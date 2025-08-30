import { ApiError, ApiResponse, ClockInRequest, ClockInResponse } from "@/types/api";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { mobileQueryKeys } from "../query-keys";
import { nurseApi } from "@/services/api";

export const useClockIn = (
    options?: UseMutationOptions<ApiResponse<ClockInResponse>, ApiError, ClockInRequest>
  ) => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: nurseApi.attendance.clockIn,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: mobileQueryKeys.attendance });
        queryClient.invalidateQueries({ queryKey: mobileQueryKeys.dashboard });
      },
      ...options,
    });
  };