import { ApiError, ApiResponse, CreateTimeOffRequest, TimeOffRequest } from "@/types/api";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { mobileQueryKeys } from "../query-keys";
import { nurseApi } from "@/services/api";

export const useCreateTimeOffRequest = (
    options?: UseMutationOptions<ApiResponse<TimeOffRequest>, ApiError, CreateTimeOffRequest>
  ) => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: nurseApi.timeOff.createTimeOffRequest,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: mobileQueryKeys.timeOff });
      },
      ...options,
    });
  };