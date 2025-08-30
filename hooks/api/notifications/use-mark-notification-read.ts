import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { ApiError, ApiResponse } from "@/types/api";
import { nurseApi } from "@/services/api";
import { mobileQueryKeys } from "../query-keys";

export const useMarkNotificationRead = (
    options?: UseMutationOptions<ApiResponse<{ message: string }>, ApiError, number>
  ) => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: nurseApi.notifications.markAsRead,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: mobileQueryKeys.notifications });
        queryClient.invalidateQueries({ queryKey: mobileQueryKeys.dashboard });
      },
      ...options,
    });
  };