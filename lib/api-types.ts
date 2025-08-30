// API Types for Mobile App
// These types represent the structure of your web app's API endpoints
// They can be used for type safety when making API calls

// Common Types
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: PaginationResponse;
  timestamp: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  timestamp: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: true;
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      facilityId?: number;
    };
    session: {
      id: string;
      userId: string;
      expiresAt: number;
    };
    token: string;
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  facilityId?: number;
}

// Nurse Types
export interface Nurse {
  id: number;
  name: string;
  email: string;
  departmentId: number;
  department?: Department;
  skills?: NurseSkill[];
  availability?: NurseAvailability;
  createdAt: string;
  updatedAt: string;
}

export interface NurseSkill {
  id: number;
  name: string;
  level: 'beginner' | 'intermediate' | 'expert';
}

export interface NurseAvailability {
  id: number;
  nurseId: number;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface NurseFatigue {
  id: number;
  nurseId: number;
  level: 'low' | 'medium' | 'high';
  reason?: string;
  recordedAt: string;
}

export interface CreateNurseRequest {
  name: string;
  email: string;
  departmentId: number;
  skills?: number[];
  availability?: Partial<NurseAvailability>[];
}

export interface UpdateNurseRequest {
  name?: string;
  email?: string;
  departmentId?: number;
}

// Department Types
export interface Department {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDepartmentRequest {
  name: string;
  description?: string;
}

// Shift Types
export interface Shift {
  id: number;
  startTime: string;
  endTime: string;
  departmentId: number;
  department?: Department;
  requiredSkills?: number[];
  maxNurses?: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  assignments?: ShiftAssignment[];
  createdAt: string;
  updatedAt: string;
}

export interface ShiftAssignment {
  id: number;
  shiftId: number;
  nurseId: number;
  nurse?: Nurse;
  startTime: string;
  endTime: string;
  status: 'assigned' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface CreateShiftRequest {
  startTime: string;
  endTime: string;
  departmentId: number;
  requiredSkills?: number[];
  maxNurses?: number;
}

export interface BulkShiftCreationRequest {
  shifts: CreateShiftRequest[];
}

export interface AutoAssignmentRequest {
  criteria?: {
    skills?: number[];
    availability?: any;
    fatigue?: any;
  };
}

// Schedule Types
export interface Schedule {
  id: number;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  departmentId?: number;
  department?: Department;
  shifts: Shift[];
  createdAt: string;
  updatedAt: string;
}

// Swap Request Types
export interface SwapRequest {
  id: number;
  currentShiftId: number;
  requestedShiftId: number;
  currentShift?: Shift;
  requestedShift?: Shift;
  requesterId: number;
  requester?: Nurse;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface CreateSwapRequestRequest {
  currentShiftId: number;
  requestedShiftId: number;
  reason?: string;
}

export interface UpdateSwapRequestRequest {
  status: 'approved' | 'rejected' | 'pending';
  reason?: string;
}

// Time-off Request Types
export interface TimeOffRequest {
  id: number;
  nurseId: number;
  nurse?: Nurse;
  startDate: string;
  endDate: string;
  reason: string;
  type: 'vacation' | 'sick' | 'personal' | 'other';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface CreateTimeOffRequestRequest {
  startDate: string;
  endDate: string;
  reason: string;
  type: 'vacation' | 'sick' | 'personal' | 'other';
}

export interface UpdateTimeOffRequestRequest {
  status: 'approved' | 'rejected' | 'pending';
  reason?: string;
}

// Attendance Types
export interface Attendance {
  id: number;
  shiftId: number;
  shift?: Shift;
  nurseId: number;
  nurse?: Nurse;
  checkInTime: string;
  checkOutTime?: string;
  status: 'present' | 'absent' | 'late' | 'early_departure';
  createdAt: string;
  updatedAt: string;
}

export interface CreateAttendanceRequest {
  shiftId: number;
  checkInTime: string;
  checkOutTime?: string;
  status: 'present' | 'absent' | 'late' | 'early_departure';
}

// Notification Types
export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  recipients?: number[];
  read: boolean;
  createdAt: string;
}

export interface CreateNotificationRequest {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  recipients?: number[];
}

export interface UpdateNotificationRequest {
  read: boolean;
}

// Report Types
export interface ReportRequest {
  type: string;
  startDate: string;
  endDate: string;
  departmentId?: number;
  format?: 'json' | 'csv' | 'pdf';
}

// Outcome Types
export interface Outcome {
  id: number;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  departmentId?: number;
  department?: Department;
  createdAt: string;
  updatedAt: string;
}

// API Endpoint Types
export interface ApiEndpoints {
  // Auth
  'POST /auth/login': {
    request: LoginRequest;
    response: LoginResponse;
  };
  'POST /auth/register': {
    request: RegisterRequest;
    response: ApiResponse<{ user: Nurse }>;
  };

  // Nurses
  'GET /nurses': {
    request: PaginationQuery & {
      search?: string;
      department?: string;
      skills?: string[];
    };
    response: ApiResponse<Nurse[]>;
  };
  'POST /nurses': {
    request: CreateNurseRequest;
    response: ApiResponse<Nurse>;
  };
  'GET /nurses/{id}': {
    request: { id: string };
    response: ApiResponse<Nurse>;
  };
  'PUT /nurses/{id}': {
    request: { id: string; data: UpdateNurseRequest };
    response: ApiResponse<Nurse>;
  };
  'DELETE /nurses/{id}': {
    request: { id: string };
    response: ApiResponse<null>;
  };
  'GET /nurses/{id}/availability': {
    request: { id: string };
    response: ApiResponse<NurseAvailability[]>;
  };
  'PUT /nurses/{id}/availability': {
    request: { id: string; data: Partial<NurseAvailability>[] };
    response: ApiResponse<NurseAvailability[]>;
  };
  'GET /nurses/{id}/skills': {
    request: { id: string };
    response: ApiResponse<NurseSkill[]>;
  };
  'POST /nurses/{id}/skills': {
    request: { id: string; data: { skillId: number } };
    response: ApiResponse<NurseSkill>;
  };
  'GET /nurses/{id}/fatigue': {
    request: { id: string };
    response: ApiResponse<NurseFatigue[]>;
  };
  'POST /nurses/{id}/fatigue': {
    request: { id: string; data: Partial<NurseFatigue> };
    response: ApiResponse<NurseFatigue>;
  };
  'GET /nurses/me': {
    request: {};
    response: ApiResponse<Nurse>;
  };
  'GET /nurses/skills': {
    request: {};
    response: ApiResponse<NurseSkill[]>;
  };

  // Departments
  'GET /departments': {
    request: PaginationQuery & { search?: string };
    response: ApiResponse<Department[]>;
  };
  'POST /departments': {
    request: CreateDepartmentRequest;
    response: ApiResponse<Department>;
  };
  'GET /departments/{id}': {
    request: { id: string };
    response: ApiResponse<Department>;
  };
  'PUT /departments/{id}': {
    request: { id: string; data: Partial<CreateDepartmentRequest> };
    response: ApiResponse<Department>;
  };
  'DELETE /departments/{id}': {
    request: { id: string };
    response: ApiResponse<null>;
  };

  // Shifts
  'GET /shifts': {
    request: PaginationQuery & {
      startDate?: string;
      endDate?: string;
      departmentId?: number;
      nurseId?: number;
      status?: string;
    };
    response: ApiResponse<Shift[]>;
  };
  'POST /shifts': {
    request: CreateShiftRequest;
    response: ApiResponse<Shift>;
  };
  'POST /shifts/bulk': {
    request: BulkShiftCreationRequest;
    response: ApiResponse<Shift[]>;
  };
  'GET /shifts/{id}': {
    request: { id: string };
    response: ApiResponse<Shift>;
  };
  'PUT /shifts/{id}': {
    request: { id: string; data: Partial<CreateShiftRequest> };
    response: ApiResponse<Shift>;
  };
  'DELETE /shifts/{id}': {
    request: { id: string };
    response: ApiResponse<null>;
  };
  'POST /shifts/{id}/auto-assign': {
    request: { id: string; data?: AutoAssignmentRequest };
    response: ApiResponse<ShiftAssignment[]>;
  };
  'GET /shifts/{id}/assignments': {
    request: { id: string };
    response: ApiResponse<ShiftAssignment[]>;
  };
  'POST /shifts/{id}/assignments': {
    request: { id: string; data: Partial<ShiftAssignment> };
    response: ApiResponse<ShiftAssignment>;
  };
  'DELETE /shifts/{id}/assignments/{assignmentId}': {
    request: { id: string; assignmentId: string };
    response: ApiResponse<null>;
  };

  // Schedules
  'GET /schedules': {
    request: PaginationQuery & {
      startDate?: string;
      endDate?: string;
      departmentId?: number;
    };
    response: ApiResponse<Schedule[]>;
  };
  'POST /schedules': {
    request: Partial<Schedule>;
    response: ApiResponse<Schedule>;
  };
  'GET /schedules/{id}': {
    request: { id: string };
    response: ApiResponse<Schedule>;
  };
  'PUT /schedules/{id}': {
    request: { id: string; data: Partial<Schedule> };
    response: ApiResponse<Schedule>;
  };
  'DELETE /schedules/{id}': {
    request: { id: string };
    response: ApiResponse<null>;
  };

  // Swap Requests
  'GET /swap-requests': {
    request: PaginationQuery & {
      status?: string;
      nurseId?: number;
    };
    response: ApiResponse<SwapRequest[]>;
  };
  'POST /swap-requests': {
    request: CreateSwapRequestRequest;
    response: ApiResponse<SwapRequest>;
  };
  'GET /swap-requests/{id}': {
    request: { id: string };
    response: ApiResponse<SwapRequest>;
  };
  'PUT /swap-requests/{id}': {
    request: { id: string; data: UpdateSwapRequestRequest };
    response: ApiResponse<SwapRequest>;
  };

  // Time-off Requests
  'GET /time-off-requests': {
    request: PaginationQuery & {
      status?: string;
      nurseId?: number;
      startDate?: string;
      endDate?: string;
    };
    response: ApiResponse<TimeOffRequest[]>;
  };
  'POST /time-off-requests': {
    request: CreateTimeOffRequestRequest;
    response: ApiResponse<TimeOffRequest>;
  };
  'GET /time-off-requests/{id}': {
    request: { id: string };
    response: ApiResponse<TimeOffRequest>;
  };
  'PUT /time-off-requests/{id}': {
    request: { id: string; data: UpdateTimeOffRequestRequest };
    response: ApiResponse<TimeOffRequest>;
  };

  // Attendance
  'GET /attendance': {
    request: PaginationQuery & {
      date?: string;
      nurseId?: number;
      departmentId?: number;
    };
    response: ApiResponse<Attendance[]>;
  };
  'POST /attendance': {
    request: CreateAttendanceRequest;
    response: ApiResponse<Attendance>;
  };
  'GET /attendance/{id}': {
    request: { id: string };
    response: ApiResponse<Attendance>;
  };
  'PUT /attendance/{id}': {
    request: { id: string; data: Partial<CreateAttendanceRequest> };
    response: ApiResponse<Attendance>;
  };

  // Notifications
  'GET /notifications': {
    request: PaginationQuery & {
      read?: boolean;
      type?: string;
    };
    response: ApiResponse<Notification[]>;
  };
  'POST /notifications': {
    request: CreateNotificationRequest;
    response: ApiResponse<Notification>;
  };
  'GET /notifications/{id}': {
    request: { id: string };
    response: ApiResponse<Notification>;
  };
  'PUT /notifications/{id}': {
    request: { id: string; data: UpdateNotificationRequest };
    response: ApiResponse<Notification>;
  };

  // Reports
  'GET /reports': {
    request: ReportRequest;
    response: Response; // Binary response for CSV/PDF
  };

  // Outcomes
  'GET /outcomes': {
    request: PaginationQuery & {
      startDate?: string;
      endDate?: string;
      departmentId?: number;
    };
    response: ApiResponse<Outcome[]>;
  };
  'POST /outcomes': {
    request: Partial<Outcome>;
    response: ApiResponse<Outcome>;
  };
  'GET /outcomes/{id}': {
    request: { id: string };
    response: ApiResponse<Outcome>;
  };
  'PUT /outcomes/{id}': {
    request: { id: string; data: Partial<Outcome> };
    response: ApiResponse<Outcome>;
  };
}

// Helper type to extract request/response types for a specific endpoint
export type ApiRequest<T extends keyof ApiEndpoints> = ApiEndpoints[T]['request'];
export type ApiResponse<T extends keyof ApiEndpoints> = ApiEndpoints[T]['response'];


