// hooks/api/auth/use-password-change.ts
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";

interface PasswordChangeRequest {
  oldPassword: string;
  newPassword: string;
}

interface PasswordChangeResponse {
  success: boolean;
  message: string;
}

export const usePasswordChange = () => {
  const { nurse, setRequiresPasswordChange } = useAuthStore();

  return useMutation({
    mutationFn: async ({ oldPassword, newPassword }: PasswordChangeRequest): Promise<PasswordChangeResponse> => {
      if (!nurse) {
        throw new Error('No authenticated user found');
      }

      // Validate old password (check if it's the default password)
      if (oldPassword !== 'auca#123') {
        throw new Error('Current password is incorrect');
      }

      // Validate new password requirements
      const validatePassword = (password: string): string[] => {
        const errors: string[] = [];
        
        if (password.length < 8) {
          errors.push('Password must be at least 8 characters long');
        }
        
        if (!/[A-Z]/.test(password)) {
          errors.push('Password must contain at least one uppercase letter');
        }
        
        if (!/[a-z]/.test(password)) {
          errors.push('Password must contain at least one lowercase letter');
        }
        
        if (!/[0-9]/.test(password)) {
          errors.push('Password must contain at least one number');
        }
        
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
          errors.push('Password must contain at least one special character');
        }
        
        return errors;
      };

      const passwordErrors = validatePassword(newPassword);
      if (passwordErrors.length > 0) {
        throw new Error(passwordErrors.join('. '));
      }

      if (oldPassword === newPassword) {
        throw new Error('New password must be different from current password');
      }

      // Simulate API call delay (mock implementation)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock successful response
      return {
        success: true,
        message: 'Password changed successfully'
      };
    },
    onSuccess: () => {
      // Mark that password change is no longer required
      setRequiresPasswordChange(false);
    },
  });
};