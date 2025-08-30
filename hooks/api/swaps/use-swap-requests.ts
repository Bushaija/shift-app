import { ApiError, PaginatedResponse, SwapFilters, SwapRequest } from "@/types/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { mobileQueryKeys } from "../query-keys";
import { nurseApi } from "@/services/api";

export const useSwapRequests = (
    filters?: SwapFilters,
    options?: UseQueryOptions<PaginatedResponse<SwapRequest>, ApiError>
  ) => {
    return useQuery({
      queryKey: mobileQueryKeys.swapsList(filters),
      queryFn: () => nurseApi.swaps.getSwapRequests(filters),
      ...options,
    });
  };