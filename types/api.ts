// Base API Types
export interface ApiError {
    success: false;
    message: string;
    errors?: Array<{
      field: string;
      message: string;
      code: string;
    }>;
    timestamp: string;
    request_id?: string;
  }
  
  export interface ApiResponse<T> {
    success: true;
    data: T;
    timestamp: string;
    message?: string;
  }
  
  export interface PaginatedResponse<T> {
    success: true;
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
    timestamp: string;
  }
  
  // Authentication Types
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    success: true;
    token: string;
    refresh_token: string;
    user: User;
    expires_in: number;
  }
  
  export interface RefreshTokenRequest {
    refresh_token: string;
  }
  
  export interface RefreshTokenResponse {
    token: string;
    expires_in: number;
  }
  
  // Core Entity Types
  export interface User {
    user_id: number;
    name: string;
    email: string;
    phone: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  }
  
  export interface NursePreferences {
    prefers_day_shifts: boolean;
    prefers_night_shifts: boolean;
    weekend_availability: boolean;
    holiday_availability: boolean;
    float_pool_member: boolean;
  }
  
  export interface Nurse {
    worker_id: number;
    user: User;
    employee_id: string;
    specialization: string;
    license_number: string;
    certification: string;
    hire_date: string;
    employment_type: 'full_time' | 'part_time' | 'per_diem' | 'travel';
    base_hourly_rate: number;
    overtime_rate: number;
    max_hours_per_week: number;
    max_consecutive_days: number;
    min_hours_between_shifts: number;
    preferences: NursePreferences;
    seniority_points: number;
    fatigue_score: number;
    skills: NurseSkill[];
  }
  
  export interface NurseSkill {
    skill_id: number;
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    certified_date?: string;
    expires_date?: string;
  }
  
  export interface Department {
    department_id: number;
    name: string;
    code: string;
    is_active: boolean;
  }
  
  export interface ShiftAssignment {
    assignment_id: number;
    nurse: Nurse;
    shift_id: number;
    is_primary: boolean;
    patient_load: number;
    status: 'assigned' | 'confirmed' | 'completed' | 'cancelled';
    assigned_at: string;
    confirmed_at?: string;
  }
  
  export interface Shift {
    shift_id: number;
    department: Department;
    start_time: string;
    end_time: string;
    shift_type: 'day' | 'night' | 'evening' | 'weekend' | 'holiday' | 'on_call' | 'float';
    required_nurses: number;
    assigned_nurses: number;
    required_skills: number[];
    patient_ratio_target: number;
    notes?: string;
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'understaffed' | 'overstaffed';
    priority_score: number;
    auto_generated: boolean;
    assignments: ShiftAssignment[];
  }
  
  // Availability Types
  export interface NurseAvailability {
    day_of_week: number; // 1 = Monday
    start_time: string; // "07:00:00"
    end_time: string; // "19:00:00"
    is_preferred: boolean;
    is_available: boolean;
  }
  
  export interface UpdateAvailabilityRequest {
    availability: NurseAvailability[];
  }
  
  // Fatigue Assessment Types
  export interface FatigueAssessment {
    assessment_id: number;
    nurse: Nurse;
    assessment_date: string;
    hours_worked_last_24h: number;
    hours_worked_last_7days: number;
    consecutive_shifts: number;
    sleep_hours_reported: number;
    stress_level_reported: number; // 1-10 scale
    fatigue_risk_score: number; // 0-100
    risk_level: 'low' | 'medium' | 'high' | 'critical';
    recommendations?: string;
  }
  
  export interface CreateFatigueAssessmentRequest {
    sleep_hours_reported: number;
    stress_level_reported: number;
    caffeine_intake_level?: number;
    notes?: string;
  }
  
  // Shift Query Filters
  export interface ShiftFilters {
    page?: number;
    limit?: number;
    department_id?: number;
    start_date?: string; // YYYY-MM-DD
    end_date?: string; // YYYY-MM-DD
    shift_type?: 'day' | 'night' | 'evening' | 'weekend' | 'holiday' | 'on_call' | 'float';
    status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'understaffed' | 'overstaffed';
    nurse_id?: number;
  }
  
  // Shift Swapping Types
  export interface SwapRequest {
    swap_id: number;
    requesting_nurse: Nurse;
    target_nurse?: Nurse;
    original_shift: Shift;
    requested_shift?: Shift;
    swap_type: 'full_shift' | 'partial_shift' | 'open_request';
    reason: string;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'expired';
    expires_at: string;
    created_at: string;
    updated_at?: string;
  }
  
  export interface CreateSwapRequest {
    original_shift_id: number;
    target_nurse_id?: number;
    requested_shift_id?: number;
    swap_type: 'full_shift' | 'partial_shift' | 'open_request';
    reason: string;
    expires_in_hours?: number;
  }
  
  export interface SwapOpportunity {
    swap_request: SwapRequest;
    compatibility_score: number;
    match_reasons: string[];
  }
  
  export interface SwapFilters {
    page?: number;
    limit?: number;
    status?: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'expired';
    nurse_id?: number;
    department_id?: number;
    start_date?: string;
    end_date?: string;
  }
  
  // Time Off Types
  export interface TimeOffRequest {
    request_id: number;
    nurse: Nurse;
    start_date: string;
    end_date: string;
    request_type: 'vacation' | 'sick' | 'personal' | 'family' | 'emergency';
    reason?: string;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    submitted_at: string;
    reviewed_at?: string;
    admin_notes?: string;
  }
  
  export interface CreateTimeOffRequest {
    start_date: string; // YYYY-MM-DD
    end_date: string; // YYYY-MM-DD
    request_type: 'vacation' | 'sick' | 'personal' | 'family' | 'emergency';
    reason?: string;
  }
  
  export interface TimeOffFilters {
    page?: number;
    limit?: number;
    nurse_id?: number;
    status?: 'pending' | 'approved' | 'rejected' | 'cancelled';
    request_type?: 'vacation' | 'sick' | 'personal' | 'family' | 'emergency';
    start_date?: string;
    end_date?: string;
  }
  
  // Attendance Types
  export interface AttendanceRecord {
    record_id: number;
    assignment: ShiftAssignment;
    scheduled_start: string;
    scheduled_end: string;
    clock_in_time?: string;
    clock_out_time?: string;
    break_duration_minutes?: number;
    overtime_minutes?: number;
    late_minutes?: number;
    patient_count_start?: number;
    patient_count_end?: number;
    status: 'scheduled' | 'present' | 'absent' | 'late' | 'completed';
    notes?: string;
  }
  
  export interface ClockInRequest {
    assignment_id: number;
    location_lat?: number;
    location_lng?: number;
    notes?: string;
  }
  
  export interface ClockInResponse {
    record_id: number;
    clock_in_time: string;
    late_minutes?: number;
    warnings?: string[];
  }
  
  export interface ShiftSummary {
    total_patients_cared: number;
    procedures_performed: number;
    incidents_reported: number;
  }
  
  export interface ClockOutRequest {
    assignment_id: number;
    patient_count_end?: number;
    notes?: string;
    shift_summary?: ShiftSummary;
  }
  
  export interface ClockOutResponse {
    record_id: number;
    clock_out_time: string;
    total_hours: number;
    overtime_minutes?: number;
    violations: string[];
  }
  
  export interface AttendanceFilters {
    page?: number;
    limit?: number;
    nurse_id?: number;
    shift_id?: number;
    start_date?: string;
    end_date?: string;
    status?: 'scheduled' | 'present' | 'absent' | 'late' | 'completed';
  }
  
  // Notifications Types
  export interface Notification {
    notification_id: number;
    category: 'shift_update' | 'swap_request' | 'time_off' | 'attendance' | 'compliance' | 'general';
    title: string;
    message: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    action_required: boolean;
    action_url?: string;
    sent_at: string;
    read_at?: string;
    is_read: boolean;
    expires_at?: string;
  }
  
  export interface NotificationFilters {
    page?: number;
    limit?: number;
    unread_only?: boolean;
    category?: 'shift_update' | 'swap_request' | 'time_off' | 'attendance' | 'compliance' | 'general';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
  }
  
  // Compliance Types
  export interface ComplianceViolation {
    violation_id: number;
    nurse: Nurse;
    violation_type: 'overtime_exceeded' | 'insufficient_rest' | 'missing_break' | 'late_arrival' | 'early_departure';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    detected_at: string;
    resolved_at?: string;
    requires_action: boolean;
    auto_detected: boolean;
  }
  
  export interface ComplianceFilters {
    page?: number;
    limit?: number;
    nurse_id?: number;
    violation_type?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    resolved?: boolean;
    start_date?: string;
    end_date?: string;
  }
  
  // Dashboard Metrics (for mobile dashboard)
  export interface MobileDashboardMetrics {
    upcoming_shifts: {
      next_shift?: Shift;
      shifts_this_week: number;
      hours_this_week: number;
    };
    current_status: {
      is_on_shift: boolean;
      current_shift?: Shift;
      fatigue_score: number;
      compliance_status: 'good' | 'warning' | 'violation';
    };
    recent_activity: {
      unread_notifications: number;
      pending_swaps: number;
      pending_time_off: number;
    };
    workload: {
      hours_this_month: number;
      overtime_hours_this_month: number;
      average_patient_ratio: number;
    };
  }
  
  // Update Profile Types
  export interface UpdateNurseProfileRequest {
    phone?: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    preferences?: Partial<NursePreferences>;
    max_hours_per_week?: number;
  }
  
  export interface UpdateUserProfileRequest {
    name?: string;
    phone?: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
  }