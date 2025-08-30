import { 
    ShiftFilters,
    SwapFilters,
    TimeOffFilters,
    AttendanceFilters,
    NotificationFilters,
    ComplianceFilters,
} from '@/types/api';

export const mobileQueryKeys = {
    // Auth
    auth: ['auth'] as const,
    
    // Profile
    profile: ['profile'] as const,
    nurse: (id: number) => [...mobileQueryKeys.profile, 'nurse', id] as const,
    cancel: (swapId: number) => [...mobileQueryKeys.swaps.all, 'cancel', swapId] as const,
    opportunities: (nurseId: number) => [...mobileQueryKeys.swaps.all, 'opportunities', nurseId] as const,
    availability: (nurseId: number) => [...mobileQueryKeys.profile, 'availability', nurseId] as const,
    fatigue: (nurseId: number, days?: number) => [...mobileQueryKeys.profile, 'fatigue', nurseId, { days }] as const,
    
    // Nurses
    nurses: {
        all: ['nurses'] as const,
        lists: () => [...mobileQueryKeys.nurses.all, 'list'] as const,
        list: (filters?: any) => [...mobileQueryKeys.nurses.lists(), filters] as const,
        details: () => [...mobileQueryKeys.nurses.all, 'detail'] as const,
        detail: (id: number) => [...mobileQueryKeys.nurses.details(), id] as const,
    },
    
    // Shifts
    shifts: ['shifts'] as const,
    shiftsList: (filters?: ShiftFilters) => [...mobileQueryKeys.shifts, 'list', filters] as const,
    shift: (id: number) => [...mobileQueryKeys.shifts, id] as const,
    myShifts: (nurseId: number, filters?: ShiftFilters) => [...mobileQueryKeys.shifts, 'my-shifts', nurseId, filters] as const,
    todayShift: (nurseId: number) => [...mobileQueryKeys.shifts, 'today-shift', nurseId] as const,
    
    // Swaps
    swaps: {
      all: ['swaps'] as const,
      lists: () => [...mobileQueryKeys.swaps.all, 'list'] as const,
      list: (filters?: any) => [...mobileQueryKeys.swaps.lists(), filters] as const,
      details: () => [...mobileQueryKeys.swaps.all, 'detail'] as const,
      detail: (id: number) => [...mobileQueryKeys.swaps.details(), id] as const,
      opportunities: (nurseId: number) => [...mobileQueryKeys.swaps.all, 'opportunities', nurseId] as const,
    },
    mySwapRequests: (nurseId: number, filters?: any) => ['my-swap-requests', nurseId, filters],
    swapOpportunities: (nurseId: number, filters?: any) => [
        'swap-opportunities',
        nurseId,
        filters,
    ],
    
    // Time Off
    timeOff: ['time-off'] as const,
    timeOffList: (filters?: TimeOffFilters) => [...mobileQueryKeys.timeOff, 'list', filters] as const,

    // Departments
    departments: {
        all: ['departments'] as const,
        details: () => ['departments', 'detail'] as const,
        detail: (id: number) => ['departments', 'detail', id] as const,
    },
    
    // Attendance
    attendance: ['attendance'] as const,
    attendanceList: (filters?: AttendanceFilters) => [...mobileQueryKeys.attendance, 'list', filters] as const,
    
    // Notifications
    notifications: ['notifications'] as const,
    notificationsList: (filters?: NotificationFilters) => [...mobileQueryKeys.notifications, 'list', filters] as const,
    
    // Compliance
    compliance: ['compliance'] as const,
    violations: (filters?: ComplianceFilters) => [...mobileQueryKeys.compliance, 'violations', filters] as const,
    
    // Dashboard
    dashboard: ['dashboard'] as const,
    dashboardMetrics: (nurseId: number) => [...mobileQueryKeys.dashboard, 'metrics', nurseId] as const,
  };