import { useAuthStore } from '@/stores/auth-store';


// API Configuration
// const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.healthcare-staffing.com';
const API_BASE_URL = 'http://192.168.43.45:3000/api'
const API_TIMEOUT = 10000; // 10 seconds

// Request/Response types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// Custom error class
export class ApiClientError extends Error {
  public status: number;
  public code?: string;

  constructor(message: string, status: number = 500, code?: string) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
  }
}

// API Client class
class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string, timeout: number = API_TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  // Get auth token
  private getAuthToken(): string | null {
    return useAuthStore.getState().token;
  }

  // Create request headers
  private createHeaders(includeAuth: boolean = true): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Handle response
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = 'An error occurred';
      let errorCode: string | undefined;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        errorCode = errorData.code;
      } catch {
        // If we can't parse the error response, use the status text
        errorMessage = response.statusText || errorMessage;
      }

      // Handle specific status codes
      switch (response.status) {
        case 401:
          // Unauthorized - clear auth and redirect to login
          useAuthStore.getState().signOut();
          throw new ApiClientError('Session expired. Please sign in again.', 401, 'UNAUTHORIZED');

        case 403:
          throw new ApiClientError('Access denied', 403, 'FORBIDDEN');

        case 404:
          throw new ApiClientError('Resource not found', 404, 'NOT_FOUND');

        case 422:
          throw new ApiClientError('Validation error', 422, 'VALIDATION_ERROR');

        case 429:
          throw new ApiClientError('Too many requests. Please try again later.', 429, 'RATE_LIMITED');

        case 500:
          throw new ApiClientError('Server error. Please try again later.', 500, 'SERVER_ERROR');

        default:
          throw new ApiClientError(errorMessage, response.status, errorCode);
      }
    }

    try {
      const data = await response.json();
      return data;
    } catch (error) {
      throw new ApiClientError('Invalid response format', response.status, 'INVALID_RESPONSE');
    }
  }

  // Make HTTP request
  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    includeAuth: boolean = true
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.createHeaders(includeAuth);

    const config: RequestInit = {
      method,
      headers,
      signal: AbortSignal.timeout(this.timeout),
    };

    if (data && method !== 'GET') {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);
      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiClientError('Request timeout', 408, 'TIMEOUT');
        }
        throw new ApiClientError(error.message, 0, 'NETWORK_ERROR');
      }

      throw new ApiClientError('Unknown error occurred', 0, 'UNKNOWN_ERROR');
    }
  }

  // HTTP methods
  public async get<T>(endpoint: string, includeAuth: boolean = true): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, includeAuth);
  }

  public async post<T>(endpoint: string, data?: any, includeAuth: boolean = true): Promise<T> {
    return this.request<T>('POST', endpoint, data, includeAuth);
  }

  public async put<T>(endpoint: string, data?: any, includeAuth: boolean = true): Promise<T> {
    return this.request<T>('PUT', endpoint, data, includeAuth);
  }

  public async patch<T>(endpoint: string, data?: any, includeAuth: boolean = true): Promise<T> {
    return this.request<T>('PATCH', endpoint, data, includeAuth);
  }

  public async delete<T>(endpoint: string, includeAuth: boolean = true): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, includeAuth);
  }

  // Upload file
  public async upload<T>(
    endpoint: string,
    file: File | Blob,
    fileName: string,
    includeAuth: boolean = true
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {};

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const formData = new FormData();
    formData.append('file', file, fileName);

    const config: RequestInit = {
      method: 'POST',
      headers,
      body: formData,
      signal: AbortSignal.timeout(this.timeout),
    };

    try {
      const response = await fetch(url, config);
      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error;
      }

      throw new ApiClientError('Upload failed', 0, 'UPLOAD_ERROR');
    }
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export types for use in other modules
export type { ApiResponse, ApiError };
export { ApiClientError };




