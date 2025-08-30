import { nurseApi } from "@/services/api";
import { mobileQueryKeys } from "../query-keys";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { ApiError, ApiResponse } from "@/types/api";

export const useCancelTimeOffRequest = (
    options?: UseMutationOptions<ApiResponse<{ message: string }>, ApiError, number>
  ) => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: nurseApi.timeOff.cancelTimeOffRequest,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: mobileQueryKeys.timeOff });
      },
      ...options,
    });
  };