import { ApiError, ApiResponse } from "@/types/api";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import nurseApi from "@/services/api";

  export const useLogout = (
    options?: UseMutationOptions<ApiResponse<{ message: string }>, ApiError, void>
  ) => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: nurseApi.auth.logout,
      onSuccess: () => {
        // Clear all cached data on logout
        queryClient.clear();
      },
      ...options,
    });
  };