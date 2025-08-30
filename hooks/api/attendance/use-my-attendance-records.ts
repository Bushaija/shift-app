import { ApiError, AttendanceFilters, AttendanceRecord, PaginatedResponse } from "@/types/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { mobileQueryKeys } from "../query-keys";
import { nurseApi } from "@/services/api";

export const useMyAttendanceRecords = (
    nurseId: number,
    filters?: Omit<AttendanceFilters, 'nurse_id'>,
    options?: UseQueryOptions<PaginatedResponse<AttendanceRecord>, ApiError>
  ) => {
    return useQuery({
      queryKey: mobileQueryKeys.attendanceList({ ...filters, nurse_id: nurseId }),
      queryFn: () => nurseApi.attendance.getAttendanceRecords({ ...filters, nurse_id: nurseId }),
      enabled: !!nurseId,
      ...options,
    });
  };