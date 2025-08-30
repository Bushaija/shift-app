import { ApiError, ApiResponse, CreateSwapRequest, SwapRequest } from "@/types/api";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { mobileQueryKeys } from "../query-keys";
import { nurseApi } from "@/services/api";

export const useCreateSwapRequest = (
    options?: UseMutationOptions<ApiResponse<SwapRequest>, ApiError, CreateSwapRequest>
  ) => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: nurseApi.swaps.createSwapRequest,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: mobileQueryKeys.swaps });
      },
      ...options,
    });
  };