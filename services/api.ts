import {
  ApiResponse,
  PaginatedResponse,
  ApiError,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  Nurse,
  Shift,
  ShiftFilters,
  NurseAvailability,
  UpdateAvailabilityRequest,
  FatigueAssessment,
  CreateFatigueAssessmentRequest,
  SwapRequest,
  CreateSwapRequest,
  SwapOpportunity,
  SwapFilters,
  TimeOffRequest,
  CreateTimeOffRequest,
  TimeOffFilters,
  AttendanceRecord,
  AttendanceFilters,
  ClockInRequest,
  ClockInResponse,
  ClockOutRequest,
  ClockOutResponse,
  Notification,
  NotificationFilters,
  ComplianceViolation,
  ComplianceFilters,
  MobileDashboardMetrics,
  UpdateNurseProfileRequest,
} from '@/types/api';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://192.168.43.45:3000/api';

// Custom error class
class ApiRequestError extends Error implements ApiError {
  success = false as const;
  message: string;
  errors?: Array<{ field: string; message: string; code: string }>;
  timestamp: string;
  request_id?: string;

  constructor(
    message: string,
    errors?: Array<{ field: string; message: string; code: string }>,
    timestamp: string = new Date().toISOString(),
    request_id?: string
  ) {
    super(message);
    this.name = 'ApiRequestError';
    this.message = message;
    this.errors = errors;
    this.timestamp = timestamp;
    this.request_id = request_id;
  }
}

// Token management
let authToken: string | null = null;

export const setAuthToken = (token: string | null): void => {
  authToken = token;
};

export const getAuthToken = (): string | null => {
  return authToken;
};

// Generic API request function
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiRequestError(
        errorData.message || `HTTP error! status: ${response.status}`,
        errorData.errors,
        errorData.timestamp,
        errorData.request_id
      );
    }
    
    return response.json();
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw error;
    }
    throw new ApiRequestError(
      error instanceof Error ? error.message : 'Network error'
    );
  }
};

// Helper function to build query strings
const buildQueryString = (params: Record<string, any>): string => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value.toString());
    }
  });
  
  return queryParams.toString();
};

// ============================================================================
// NURSE API SERVICE
// ============================================================================

export const nurseApi = {
  // ============================================================================
  // AUTHENTICATION
  // ============================================================================
  auth: {
    login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
      return apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    },

    refreshToken: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
      return apiRequest('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    logout: async (): Promise<ApiResponse<{ message: string }>> => {
      return apiRequest('/auth/logout', {
        method: 'POST',
      });
    },
  },

  // ============================================================================
  // NURSE PROFILE
  // ============================================================================
  getNurse: async (nurseId: number): Promise<ApiResponse<Nurse>> => {
    return apiRequest(`/nurses/${nurseId}`);
  },

  updateNurse: async (nurseId: number, data: UpdateNurseProfileRequest): Promise<ApiResponse<Nurse>> => {
    return apiRequest(`/nurses/${nurseId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  getAvailability: async (
    nurseId: number,
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<NurseAvailability[]>> => {
    const params = buildQueryString({ start_date: startDate, end_date: endDate });
    const endpoint = `/nurses/${nurseId}/availability${params ? `?${params}` : ''}`;
    return apiRequest(endpoint);
  },

  updateAvailability: async (
    nurseId: number,
    data: UpdateAvailabilityRequest
  ): Promise<ApiResponse<{ message: string }>> => {
    return apiRequest(`/nurses/${nurseId}/availability`, {
      method: 'PUT',
      body: JSON.stringify(data.availability),
    });
  },

  getFatigueHistory: async (
    nurseId: number,
    days: number = 30
  ): Promise<ApiResponse<FatigueAssessment[]>> => {
    return apiRequest(`/nurses/${nurseId}/fatigue?days=${days}`);
  },

  createFatigueAssessment: async (
    nurseId: number,
    data: CreateFatigueAssessmentRequest
  ): Promise<ApiResponse<FatigueAssessment>> => {
    return apiRequest(`/nurses/${nurseId}/fatigue`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // ============================================================================
  // NURSES
  // ============================================================================
  nurses: {
    getNurses: async (filters?: any): Promise<PaginatedResponse<Nurse>> => {
      const queryString = filters ? `?${buildQueryString(filters)}` : '';
      return apiRequest(`/nurses${queryString}`);
    },
  },

  // ============================================================================
  // SHIFTS
  // ============================================================================
  shifts: {
    getShifts: async (filters?: ShiftFilters): Promise<PaginatedResponse<Shift>> => {
      const params = buildQueryString(filters || {});
      const endpoint = `/shifts${params ? `?${params}` : ''}`;
      return apiRequest(endpoint);
    },

    getShift: async (shiftId: number): Promise<ApiResponse<Shift>> => {
      return apiRequest(`/shifts/${shiftId}`);
    },
  },

  // ============================================================================
  // SWAP REQUESTS
  // ============================================================================
  swaps: {
    getSwapRequests: async (filters?: SwapFilters): Promise<PaginatedResponse<SwapRequest>> => {
      const params = buildQueryString(filters || {});
      const endpoint = `/swap-requests${params ? `?${params}` : ''}`;
      return apiRequest(endpoint);
    },

    getSwapOpportunities: async (nurseId: number): Promise<ApiResponse<SwapOpportunity[]>> => {
      return apiRequest(`/swap-requests/opportunities?nurse_id=${nurseId}`);
    },

    createSwapRequest: async (data: CreateSwapRequest): Promise<ApiResponse<SwapRequest>> => {
      return apiRequest('/swap-requests', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    acceptSwapRequest: async (swapId: number): Promise<ApiResponse<{ message: string }>> => {
      return apiRequest(`/swap-requests/${swapId}/accept`, {
        method: 'POST',
      });
    },

    cancelSwapRequest: async (swapId: number): Promise<ApiResponse<{ message: string }>> => {
      return apiRequest(`/swap-requests/${swapId}/cancel`, {
        method: 'POST',
      });
    },
  },

  // ============================================================================
  // TIME OFF
  // ============================================================================
  timeOff: {
    getTimeOffRequests: async (filters?: TimeOffFilters): Promise<PaginatedResponse<TimeOffRequest>> => {
      const params = buildQueryString(filters || {});
      const endpoint = `/time-off-requests${params ? `?${params}` : ''}`;
      return apiRequest(endpoint);
    },

    createTimeOffRequest: async (data: CreateTimeOffRequest): Promise<ApiResponse<TimeOffRequest>> => {
      return apiRequest('/time-off-requests', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    cancelTimeOffRequest: async (requestId: number): Promise<ApiResponse<{ message: string }>> => {
      return apiRequest(`/time-off-requests/${requestId}`, {
        method: 'DELETE',
      });
    },
  },

  // ============================================================================
  // ATTENDANCE
  // ============================================================================
  attendance: {
    getAttendanceRecords: async (filters?: AttendanceFilters): Promise<PaginatedResponse<AttendanceRecord>> => {
      const params = buildQueryString(filters || {});
      const endpoint = `/attendance${params ? `?${params}` : ''}`;
      return apiRequest(endpoint);
    },

    clockIn: async (data: ClockInRequest): Promise<ApiResponse<ClockInResponse>> => {
      return apiRequest('/attendance/clock-in', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    clockOut: async (data: ClockOutRequest): Promise<ApiResponse<ClockOutResponse>> => {
      return apiRequest('/attendance/clock-out', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },

  // ============================================================================
  // NOTIFICATIONS
  // ============================================================================
  notifications: {
    getNotifications: async (filters?: NotificationFilters): Promise<PaginatedResponse<Notification>> => {
      const params = buildQueryString(filters || {});
      const endpoint = `/notifications${params ? `?${params}` : ''}`;
      return apiRequest(endpoint);
    },

    markAsRead: async (notificationId: number): Promise<ApiResponse<{ message: string }>> => {
      return apiRequest(`/notifications/${notificationId}/read`, {
        method: 'POST',
      });
    },

    markAllAsRead: async (payload: { userId: number; category?: string }): Promise<ApiResponse<{ message: string }>> => {
      return apiRequest('/notifications/read-all', {
        method: 'POST',
        body: JSON.stringify({ userId: payload.userId, category: payload.category ?? '' }),
      });
    },
  },

  // ============================================================================
  // COMPLIANCE
  // ============================================================================
  compliance: {
    getViolations: async (filters?: ComplianceFilters): Promise<PaginatedResponse<ComplianceViolation>> => {
      const params = buildQueryString(filters || {});
      const endpoint = `/compliance/violations${params ? `?${params}` : ''}`;
      return apiRequest(endpoint);
    },
  },

  // ============================================================================
  // DASHBOARD
  // ============================================================================
  dashboard: {
    getMobileDashboard: async (nurseId: number): Promise<ApiResponse<MobileDashboardMetrics>> => {
      return apiRequest(`/dashboard/mobile/${nurseId}`);
    },
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format date to API expected format (YYYY-MM-DD)
 */
export const formatDateForApi = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Get start and end of current week
 */
export const getCurrentWeekDates = () => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  
  return {
    startDate: formatDateForApi(startOfWeek),
    endDate: formatDateForApi(endOfWeek),
  };
};

/**
 * Get start and end of current month
 */
export const getCurrentMonthDates = () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  return {
    startDate: formatDateForApi(startOfMonth),
    endDate: formatDateForApi(endOfMonth),
  };
};

/**
 * Check if a shift is currently active
 */
export const isShiftActive = (shift: Shift): boolean => {
  const now = new Date();
  const shiftStart = new Date(shift.start_time);
  const shiftEnd = new Date(shift.end_time);
  
  return now >= shiftStart && now <= shiftEnd;
};

/**
 * Calculate hours between two timestamps
 */
export const calculateHours = (startTime: string, endTime: string): number => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
};

/**
 * Format time duration to readable string
 */
export const formatDuration = (hours: number): string => {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  
  if (wholeHours === 0) {
    return `${minutes}m`;
  } else if (minutes === 0) {
    return `${wholeHours}h`;
  } else {
    return `${wholeHours}h ${minutes}m`;
  }
};

/**
 * Get shift type display name
 */
export const getShiftTypeDisplayName = (shiftType: Shift['shift_type']): string => {
  const displayNames: Record<Shift['shift_type'], string> = {
    day: 'Day Shift',
    night: 'Night Shift',
    evening: 'Evening Shift',
    weekend: 'Weekend Shift',
    holiday: 'Holiday Shift',
    on_call: 'On Call',
    float: 'Float',
  };
  
  return displayNames[shiftType] || shiftType;
};

/**
 * Get employment type display name
 */
export const getEmploymentTypeDisplayName = (employmentType: Nurse['employment_type']): string => {
  const displayNames: Record<Nurse['employment_type'], string> = {
    full_time: 'Full Time',
    part_time: 'Part Time',
    per_diem: 'Per Diem',
    travel: 'Travel Nurse',
  };
  
  return displayNames[employmentType] || employmentType;
};

/**
 * Get priority color for notifications
 */
export const getPriorityColor = (priority: Notification['priority']): string => {
  const colors: Record<Notification['priority'], string> = {
    low: '#6B7280',      // Gray
    medium: '#F59E0B',   // Yellow
    high: '#EF4444',     // Red
    urgent: '#DC2626',   // Dark Red
  };
  
  return colors[priority];
};

/**
 * Get status color for shifts
 */
export const getShiftStatusColor = (status: Shift['status']): string => {
  const colors: Record<Shift['status'], string> = {
    scheduled: '#6B7280',     // Gray
    in_progress: '#3B82F6',   // Blue
    completed: '#10B981',     // Green
    cancelled: '#EF4444',     // Red
    understaffed: '#F59E0B',  // Yellow
    overstaffed: '#8B5CF6',   // Purple
  };
  
  return colors[status];
};

export default nurseApi;