import { ApiError, PaginatedResponse, TimeOffRequest, TimeOffFilters } from "@/types/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { mobileQueryKeys } from "../query-keys";
import { nurseApi } from "@/services/api";

export const useTimeOffRequests = (
    filters?: TimeOffFilters,
    options?: UseQueryOptions<PaginatedResponse<TimeOffRequest>, ApiError>
  ) => {
    return useQuery({
      queryKey: mobileQueryKeys.timeOffList(filters),
      queryFn: () => nurseApi.timeOff.getTimeOffRequests(filters),
      ...options,
    });
  };