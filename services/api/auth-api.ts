// services/api/auth-api.ts
import { PaginatedResponse, Nurse } from "@/types/api";

const API_BASE_URL = 'http://localhost:3000/api';

export const authApi = {
  // Get all nurses for email validation
  getAllNurses: async (): Promise<PaginatedResponse<Nurse>> => {
    const response = await fetch(`${API_BASE_URL}/nurses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch nurses' }));
      throw new Error(error.message || 'Failed to fetch nurses');
    }

    return response.json();
  },

  // Change password (mock implementation)
  changePassword: async (data: {
    nurserId: number;
    oldPassword: string;
    newPassword: string;
  }): Promise<{ success: boolean; message: string }> => {
    // In a real implementation, this would make an actual API call
    // For now, we'll simulate the API call with a timeout
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate validation
        if (data.oldPassword !== 'auca#123') {
          reject(new Error('Current password is incorrect'));
          return;
        }

        if (data.oldPassword === data.newPassword) {
          reject(new Error('New password must be different from current password'));
          return;
        }

        // Simulate success
        resolve({
          success: true,
          message: 'Password changed successfully'
        });
      }, 1000);
    });
  },

  // Validate nurse email
  validateNurseEmail: async (email: string): Promise<{
    valid: boolean;
    nurse?: Nurse;
    message: string;
  }> => {
    try {
      const nursesResponse = await authApi.getAllNurses();
      
      const nurse = nursesResponse.data.find(
        (nurse: Nurse) => nurse.user.email.toLowerCase() === email.toLowerCase()
      );

      if (!nurse) {
        return {
          valid: false,
          message: 'Email not found. Please contact your administrator.'
        };
      }

      if (!nurse.user.is_active) {
        return {
          valid: false,
          message: 'Your account is inactive. Please contact your administrator.'
        };
      }

      return {
        valid: true,
        nurse,
        message: 'Email validated successfully'
      };
    } catch (error) {
      throw new Error('Failed to validate email. Please try again.');
    }
  }
};

// Export individual functions for easier importing
export const { getAllNurses, changePassword, validateNurseEmail } = authApi;