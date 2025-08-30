import { hc } from "hono/client";
import type { 
  ApiEndpoints, 
  ApiRequest, 
  ApiResponse,
  Nurse,
  Shift,
  Department,
  Attendance,
  Notification,
  SwapRequest,
  TimeOffRequest
} from './api-types';

// API Router Type Definition
// This type represents the structure of your web app's API router
// For Hono client, we use a simpler approach that matches the expected interface
export type ApiRouter = any; // Using any for now to avoid type conflicts with Hono client

// API Configuration
const API_CONFIG = {
  // Use your deployed web app URL for production
  // or local development server URL for development
  // baseURL: 'http://192.168.43.45:3000/api',
  baseURL: 'http://192.168.43.45:3000/api',
  // Alternative: Use your computer's local IP address
  // baseURL: 'http://10.0.2.2:3000/api', // For Android emulator
  // baseURL: 'http://127.0.0.1:3000/api', // For iOS simulator
  // Default headers for all requests
  defaultHeaders: {
    'Content-Type': 'application/json',
    'User-Agent': 'ShiftsApp-Mobile/1.0',
  },
  
  // Request timeout in milliseconds
  timeout: 10000,
};

// Create the Hono client instance
export const apiClient = hc<ApiRouter>(API_CONFIG.baseURL, {
  headers: API_CONFIG.defaultHeaders,
  // You can add other fetch options here
});

// Export the client type
export type ApiClient = typeof apiClient;

// Custom error class for API operations
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any,
    public endpoint?: string
  ) {
    super(message);
    this.name = 'ApiError';
    
    // Add endpoint info for better debugging
    if (endpoint) {
      this.message = `[${endpoint}] ${message}`;
    }
  }
}

// Enhanced response handler with mobile-specific considerations
export async function handleApiResponse<T>(
  honoPromise: Promise<Response>,
  endpoint?: string
): Promise<T> {
  try {
    const response = await honoPromise;
    
    if (!response.ok) {
      let errorData: any = {};
      
      try {
        errorData = await response.json();
      } catch {
        // Handle cases where response is not JSON
        errorData = { message: response.statusText };
      }
      
      throw new ApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData,
        endpoint
      );
    }

    // Handle empty responses (204 No Content)
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle network errors common in mobile apps
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError(
        'Network error - please check your internet connection',
        0,
        error,
        endpoint
      );
    }
    
    throw new ApiError(
      'Unexpected error occurred',
      0,
      error,
      endpoint
    );
  }
}

// Authentication token management
class TokenManager {
  private static token: string | null = null;
  
  static setToken(token: string) {
    this.token = token;
  }
  
  static getToken(): string | null {
    return this.token;
  }
  
  static clearToken() {
    this.token = null;
  }
  
  static getAuthHeaders(): Record<string, string> {
    return this.token 
      ? { Authorization: `Bearer ${this.token}` }
      : {};
  }
}

export { TokenManager };

// Authenticated API client that includes auth headers
export const createAuthenticatedClient = (token?: string) => {
  if (token) {
    TokenManager.setToken(token);
  }
  
  return hc<ApiRouter>(API_CONFIG.baseURL, {
    headers: {
      ...API_CONFIG.defaultHeaders,
      ...TokenManager.getAuthHeaders(),
    },
  });
};

// Helper function to create requests with timeout
export const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number = API_CONFIG.timeout
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new ApiError('Request timeout', 408)), timeoutMs)
    ),
  ]);
};

// Network status checker for mobile apps
export const checkNetworkConnection = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(`${API_CONFIG.baseURL}/health`, {
      method: 'HEAD',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
};

// Retry mechanism for failed requests
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on client errors (4xx), only on server errors (5xx) or network errors
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
        throw error;
      }
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError!;
};

// Request interceptor type
export type RequestInterceptor = (request: RequestInit) => RequestInit | Promise<RequestInit>;
export type ResponseInterceptor = (response: Response) => Response | Promise<Response>;

// Interceptor manager for request/response middleware
class InterceptorManager {
  private static requestInterceptors: RequestInterceptor[] = [];
  private static responseInterceptors: ResponseInterceptor[] = [];
  
  static addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }
  
  static addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }
  
  static async processRequest(request: RequestInit): Promise<RequestInit> {
    let processedRequest = request;
    
    for (const interceptor of this.requestInterceptors) {
      processedRequest = await interceptor(processedRequest);
    }
    
    return processedRequest;
  }
  
  static async processResponse(response: Response): Promise<Response> {
    let processedResponse = response;
    
    for (const interceptor of this.responseInterceptors) {
      processedResponse = await interceptor(processedResponse);
    }
    
    return processedResponse;
  }
}

export { InterceptorManager };

// Export error schema type for consistency with web app
export type ErrorSchema = {
  error: {
    issues: {
      code: string;
      path: (string | number)[];
      message?: string | undefined;
    }[];
    name: string;
  };
  success: boolean;
};

// Note: The Hono client structure is different from what we initially expected
// For now, we'll use the basic client and you can access endpoints directly
// Example usage:
