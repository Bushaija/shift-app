import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { nurseApi } from '@/services/api';
import { mobileQueryKeys } from '../query-keys';
import { ApiError, SwapOpportunity, ApiResponse } from '@/types/api';

export const useSwappableShifts = (
  nurseId: number,
  options?: Omit<UseQueryOptions<ApiResponse<SwapOpportunity[]>, ApiError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ApiResponse<SwapOpportunity[]>, ApiError>({
    queryKey: mobileQueryKeys.swaps.opportunities(nurseId),
    queryFn: () => nurseApi.swaps.getSwapOpportunities(nurseId),
    ...options,
  });
};
