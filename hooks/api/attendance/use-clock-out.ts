import { ApiError, ApiResponse, ClockOutRequest, ClockOutResponse } from "@/types/api";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { mobileQueryKeys } from "../query-keys";
import { nurseApi } from "@/services/api";

export const useClockOut = (
    options?: UseMutationOptions<ApiResponse<ClockOutResponse>, ApiError, ClockOutRequest>
  ) => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: nurseApi.attendance.clockOut,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: mobileQueryKeys.attendance });
        queryClient.invalidateQueries({ queryKey: mobileQueryKeys.dashboard });
        queryClient.invalidateQueries({ queryKey: mobileQueryKeys.profile });
      },
      ...options,
    });
  };