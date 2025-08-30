import { nurseApi } from "@/services/api";
import { ApiError, PaginatedResponse, TimeOffRequest } from "@/types/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { mobileQueryKeys } from "../query-keys";

export const useMyTimeOffRequests = (
    nurseId: number,
    options?: UseQueryOptions<PaginatedResponse<TimeOffRequest>, ApiError>
  ) => {
    return useQuery({
      queryKey: mobileQueryKeys.timeOffList({ nurse_id: nurseId }),
      queryFn: () => nurseApi.timeOff.getTimeOffRequests({ nurse_id: nurseId }),
      enabled: !!nurseId,
      ...options,
    });
  };