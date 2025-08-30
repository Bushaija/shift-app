// stores/auth-store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Nurse } from '@/types/api';

interface AuthState {
  // Auth status
  isAuthenticated: boolean;
  requiresPasswordChange: boolean;
  
  // User data
  nurse: Nurse | null;
  token: string | null;
  refreshToken: string | null;
  
  // Actions
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setRequiresPasswordChange: (requiresPasswordChange: boolean) => void;
  setNurse: (nurse: Nurse | null) => void;
  setTokens: (token: string | null, refreshToken?: string | null) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
  
  // Password change action (mock implementation)
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      requiresPasswordChange: false,
      nurse: null,
      token: null,
      refreshToken: null,

      // Actions
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      
      setRequiresPasswordChange: (requiresPasswordChange) => 
        set({ requiresPasswordChange }),
      
      setNurse: (nurse) => set({ nurse }),
      
      setTokens: (token, refreshToken) => 
        set({ token, refreshToken }),
      
      logout: () => set({
        isAuthenticated: false,
        requiresPasswordChange: false,
        nurse: null,
        token: null,
        refreshToken: null,
      }),

      // Check authentication status on app start
      checkAuth: async () => {
        const { nurse, isAuthenticated, requiresPasswordChange } = get();
        
        // If we have a stored nurse and auth state, we're good to go
        if (nurse && isAuthenticated) {
          // Auth state is already loaded from persistence
          return;
        }
        
        // If no stored auth data, ensure we're logged out
        if (!nurse || !isAuthenticated) {
          set({
            isAuthenticated: false,
            requiresPasswordChange: false,
            nurse: null,
            token: null,
            refreshToken: null,
          });
        }
      },

      changePassword: async (oldPassword: string, newPassword: string) => {
        const { nurse } = get();
        
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

        // Simulate password change process (no actual API call)
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock successful password change - just update local state
        set({ requiresPasswordChange: false });
        
        console.log(`Password changed for nurse: ${nurse.user.name} (${nurse.user.email})`);
        console.log(`New password would be: ${newPassword}`);
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist certain fields
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        requiresPasswordChange: state.requiresPasswordChange,
        nurse: state.nurse,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
    }
  )
);