import { ApiError, PaginatedResponse, SwapRequest } from "@/types/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { mobileQueryKeys } from "../query-keys";
import { nurseApi } from "@/services/api";

export const useMySwapRequests = (
    nurseId: number,
    options?: UseQueryOptions<PaginatedResponse<SwapRequest>, ApiError>
  ) => {
    return useQuery({
      queryKey: mobileQueryKeys.swapsList({ nurse_id: nurseId }),
      queryFn: () => nurseApi.swaps.getSwapRequests({ nurse_id: nurseId }),
      enabled: !!nurseId,
      ...options,
    });
  };