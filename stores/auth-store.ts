import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getItem, setItem, removeItem } from '@/lib/storage';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  licenseType: string;
  licenseNumber?: string;
  specialties?: string[];
  hourlyRate?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  // Authentication actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: Partial<User> & { password: string }) => Promise<void>;
  signOut: () => void;
  forgotPassword: (email: string) => Promise<void>;

  // State management
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Session management
  checkAuth: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Authentication actions
      signIn: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          // TODO: Replace with actual API call
          // const response = await authApi.signIn(email, password);

          // Mock response for now
          const mockUser: User = {
            id: '1',
            email,
            firstName: 'Robert',
            lastName: 'Johnson',
            phone: '+1 (555) 123-4567',
            licenseType: 'RN',
            licenseNumber: 'RN123456',
            specialties: ['Emergency', 'ICU'],
            hourlyRate: 45,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const mockToken = 'mock-jwt-token-' + Date.now();

          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          // Store token in secure storage
          await setItem('auth_token', mockToken);

        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Sign in failed',
          });
        }
      },

      signUp: async (userData) => {
        set({ isLoading: true, error: null });

        try {
          // TODO: Replace with actual API call
          // const response = await authApi.signUp(userData);

          // Mock response for now
          const mockUser: User = {
            id: '1',
            email: userData.email!,
            firstName: userData.firstName!,
            lastName: userData.lastName!,
            phone: userData.phone,
            licenseType: userData.licenseType!,
            licenseNumber: userData.licenseNumber,
            specialties: userData.specialties,
            hourlyRate: userData.hourlyRate,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const mockToken = 'mock-jwt-token-' + Date.now();

          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          // Store token in secure storage
          await setItem('auth_token', mockToken);

        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Sign up failed',
          });
        }
      },

      signOut: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });

        // Remove token from storage
        removeItem('auth_token');
      },

      forgotPassword: async (email: string) => {
        set({ isLoading: true, error: null });

        try {
          // TODO: Replace with actual API call
          // await authApi.forgotPassword(email);

          // Mock delay
          await new Promise(resolve => setTimeout(resolve, 1000));

          set({ isLoading: false });

        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Password reset failed',
          });
        }
      },

      // State management
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Session management
      checkAuth: async () => {
        const token = await getItem('auth_token');

        if (token) {
          // TODO: Validate token with API
          // const user = await authApi.validateToken(token);

          // For now, just set as authenticated if token exists
          set({ token, isAuthenticated: true });
        } else {
          set({ token: null, isAuthenticated: false });
        }
      },

      refreshToken: async () => {
        const { token } = get();

        if (token) {
          try {
            // TODO: Replace with actual API call
            // const newToken = await authApi.refreshToken(token);
            // set({ token: newToken });

            // Mock refresh
            const newToken = 'mock-jwt-token-refreshed-' + Date.now();
            set({ token: newToken });
            await setItem('auth_token', newToken);

          } catch (error) {
            // Token refresh failed, sign out user
            get().signOut();
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => ({
        getItem: async (name: string) => {
          const value = await getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name: string, value: any) => {
          await setItem(name, JSON.stringify(value));
        },
        removeItem: async (name: string) => {
          await removeItem(name);
        },
      })),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

