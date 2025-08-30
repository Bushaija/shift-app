import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { useAuthStore } from '@/stores/auth-store';
import NurseLoginScreen from '@/app/auth/signin';
import ForcePasswordChangeScreen from '@/app/force-password-change';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
}));

// Mock the auth store
jest.mock('@/stores/auth-store', () => ({
  useAuthStore: jest.fn(),
}));

describe('Nurse Authentication Flow', () => {
  const mockSignIn = jest.fn();
  const mockChangePassword = jest.fn();
  const mockClearError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('NurseLoginScreen', () => {
    it('should render login form with default email', () => {
      (useAuthStore as jest.Mock).mockReturnValue({
        signIn: mockSignIn,
        isLoading: false,
        error: null,
        clearError: mockClearError,
        isAuthenticated: false,
        requiresPasswordChange: false,
      });

      render(<NurseLoginScreen />);
      
      expect(screen.getByDisplayValue('admin@gmail.com')).toBeTruthy();
      expect(screen.getByPlaceholderText('Enter your password')).toBeTruthy();
      expect(screen.getByText('Sign in to your Shift-Med Nurse Portal')).toBeTruthy();
    });

    it('should handle demo sign in', async () => {
      (useAuthStore as jest.Mock).mockReturnValue({
        signIn: mockSignIn,
        isLoading: false,
        error: null,
        clearError: mockClearError,
        isAuthenticated: false,
        requiresPasswordChange: false,
      });

      render(<NurseLoginScreen />);
      
      const demoButton = screen.getByText('Demo Sign In (Default: admin@gmail.com / auca#123)');
      fireEvent.press(demoButton);
      
      expect(mockSignIn).toHaveBeenCalledWith('admin@gmail.com', 'auca#123');
    });

    it('should show error message when sign in fails', () => {
      (useAuthStore as jest.Mock).mockReturnValue({
        signIn: mockSignIn,
        isLoading: false,
        error: 'Invalid credentials',
        clearError: mockClearError,
        isAuthenticated: false,
        requiresPasswordChange: false,
      });

      render(<NurseLoginScreen />);
      
      expect(screen.getByText('Invalid credentials')).toBeTruthy();
    });
  });

  describe('ForcePasswordChangeScreen', () => {
    it('should render password change form', () => {
      (useAuthStore as jest.Mock).mockReturnValue({
        changePassword: mockChangePassword,
        nurse: {
          user: { name: 'Admin User' },
          specialization: 'Emergency',
          employee_id: '1',
        },
        requiresPasswordChange: true,
      });

      render(<ForcePasswordChangeScreen />);
      
      expect(screen.getByText('Change Password')).toBeTruthy();
      expect(screen.getByText('Welcome! Please change your default password to continue')).toBeTruthy();
      expect(screen.getByDisplayValue('auca#123')).toBeTruthy();
    });

    it('should show nurse information', () => {
      (useAuthStore as jest.Mock).mockReturnValue({
        changePassword: mockChangePassword,
        nurse: {
          user: { name: 'Admin User' },
          specialization: 'Emergency',
          employee_id: '1',
        },
        requiresPasswordChange: true,
      });

      render(<ForcePasswordChangeScreen />);
      
      expect(screen.getByText('Admin User - Emergency')).toBeTruthy();
      expect(screen.getByText('Employee ID: 1')).toBeTruthy();
    });

    it('should validate password requirements', async () => {
      (useAuthStore as jest.Mock).mockReturnValue({
        changePassword: mockChangePassword,
        nurse: {
          user: { name: 'Admin User' },
          specialization: 'Emergency',
          employee_id: '1',
        },
        requiresPasswordChange: true,
      });

      render(<ForcePasswordChangeScreen />);
      
      const newPasswordInput = screen.getByPlaceholderText('Enter new password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm new password');
      const changeButton = screen.getByText('Change Password');
      
      // Test weak password
      fireEvent.changeText(newPasswordInput, 'weak');
      fireEvent.changeText(confirmPasswordInput, 'weak');
      fireEvent.press(changeButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Password must be at least 8 characters long/)).toBeTruthy();
      });
    });
  });
});

