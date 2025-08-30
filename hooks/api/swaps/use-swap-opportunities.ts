import { ApiError, ApiResponse, SwapOpportunity } from "@/types/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { mobileQueryKeys } from "../query-keys";
import { nurseApi } from "@/services/api";

export const useSwapOpportunities = (
    nurseId: number,
    options?: UseQueryOptions<ApiResponse<SwapOpportunity[]>, ApiError>
  ) => {
    return useQuery({
      queryKey: mobileQueryKeys.swapOpportunities(nurseId),
      queryFn: () => nurseApi.swaps.getSwapOpportunities(nurseId),
      enabled: !!nurseId,
      ...options,
    });
  };