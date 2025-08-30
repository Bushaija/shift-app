import { ApiError, PaginatedResponse, Shift, ShiftFilters } from "@/types/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { mobileQueryKeys } from "../query-keys";
import { nurseApi } from "@/services/api";

export const useShifts = (
    filters?: ShiftFilters,
    options?: UseQueryOptions<PaginatedResponse<Shift>, ApiError>
  ) => {
    return useQuery({
      queryKey: mobileQueryKeys.shiftsList(filters),
      queryFn: () => nurseApi.shifts.getShifts(filters),
      ...options,
    });
  };