import { ApiError, ApiResponse } from "@/types/api";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { mobileQueryKeys } from "../query-keys";
import { nurseApi } from "@/services/api";

export const useAcceptSwapRequest = (
    options?: UseMutationOptions<ApiResponse<{ message: string }>, ApiError, number>
  ) => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: nurseApi.swaps.acceptSwapRequest,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: mobileQueryKeys.swaps });
        queryClient.invalidateQueries({ queryKey: mobileQueryKeys.shifts });
      },
      ...options,
    });
  };