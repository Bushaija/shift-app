import { ApiError, PaginatedResponse } from "@/types/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { mobileQueryKeys } from "../query-keys";
import { nurseApi } from "@/services/api";
import { AttendanceFilters } from "@/types/api";
import { AttendanceRecord } from "@/types/api";

export const useAttendanceRecords = (
    filters?: AttendanceFilters,
    options?: UseQueryOptions<PaginatedResponse<AttendanceRecord>, ApiError>
  ) => {
    return useQuery({
      queryKey: mobileQueryKeys.attendanceList(filters),
      queryFn: () => nurseApi.attendance.getAttendanceRecords(filters),
      ...options,
    });
  };