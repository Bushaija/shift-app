// hooks/api/auth/use-email-auth.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mobileQueryKeys } from "../query-keys";
import { useAuthStore } from "@/stores/auth-store";
import { Nurse } from "@/types/api";
import { apiClient } from "@/services/api/client";

interface EmailAuthRequest {
  email: string;
  password: string;
}

interface EmailAuthResponse {
  success: boolean;
  nurse: Nurse;
  requiresPasswordChange: boolean;
  message: string;
}

export const useEmailAuth = () => {
  const queryClient = useQueryClient();
  const { setNurse, setRequiresPasswordChange, setIsAuthenticated } = useAuthStore();

  const mutation = useMutation({
    mutationFn: async ({ email, password }: EmailAuthRequest): Promise<EmailAuthResponse> => {
      // Try to read nurses from cache, otherwise fetch directly via API client
      let nursesResponse = queryClient.getQueryData<{ data: Nurse[] }>(mobileQueryKeys.nurses);
      if (!nursesResponse) {
        nursesResponse = await apiClient.get<{ data: Nurse[] }>("/nurses", false);
        queryClient.setQueryData(mobileQueryKeys.nurses, nursesResponse);
      }

      // Find nurse by email
      const nurse = nursesResponse.data.find(
        (nurse: Nurse) => nurse.user.email.toLowerCase() === email.toLowerCase()
      );

      if (!nurse) {
        throw new Error('Email not found. Please contact your administrator.');
      }

      if (!nurse.user.is_active) {
        throw new Error('Your account is inactive. Please contact your administrator.');
      }

      // Check if this is first login (using default password)
      const isFirstLogin = password === 'auca#123';

      return {
        success: true,
        nurse,
        requiresPasswordChange: isFirstLogin,
        message: isFirstLogin 
          ? 'First login detected. Password change required.' 
          : 'Login successful.'
      };
    },
    onSuccess: (data) => {
      // Update auth store
      setNurse(data.nurse);
      setRequiresPasswordChange(data.requiresPasswordChange);
      setIsAuthenticated(true);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};