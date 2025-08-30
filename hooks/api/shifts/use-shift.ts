import { ApiError, ApiResponse, Shift } from "@/types/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { mobileQueryKeys } from "../query-keys";
import { nurseApi } from "@/services/api";

export const useShift = (
    shiftId: number,
    options?: UseQueryOptions<ApiResponse<Shift>, ApiError>
  ) => {
    return useQuery({
      queryKey: mobileQueryKeys.shift(shiftId),
      queryFn: () => nurseApi.shifts.getShift(shiftId),
      enabled: !!shiftId,
      ...options,
    });
  };