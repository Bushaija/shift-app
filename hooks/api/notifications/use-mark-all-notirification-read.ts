import { nurseApi } from "@/services/api";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { mobileQueryKeys } from "../query-keys";
import { ApiError, ApiResponse } from "@/types/api";

export const useMarkAllNotificationsRead = (
    options?: UseMutationOptions<ApiResponse<{ message: string }>, ApiError, { userId: number; category?: string }>
  ) => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: (vars: { userId: number; category?: string }) => nurseApi.notifications.markAllAsRead(vars),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: mobileQueryKeys.notifications });
        // Invalidate unread lists
        queryClient.invalidateQueries({ queryKey: mobileQueryKeys.notificationsList({ unread_only: true }) });
        queryClient.invalidateQueries({ queryKey: mobileQueryKeys.notificationsList({ unread_only: true, priority: 'urgent' } as any) });
        // Optimistically clear unread caches so UI updates immediately
        queryClient.setQueryData(
          mobileQueryKeys.notificationsList({ unread_only: true }),
          { success: true, data: [], pagination: { total: 0, page: 1, limit: 10, total_pages: 0 }, timestamp: new Date().toISOString() }
        );
        queryClient.setQueryData(
          mobileQueryKeys.notificationsList({ unread_only: true, priority: 'urgent' } as any),
          { success: true, data: [], pagination: { total: 0, page: 1, limit: 10, total_pages: 0 }, timestamp: new Date().toISOString() }
        );
        queryClient.invalidateQueries({ queryKey: mobileQueryKeys.dashboard });
      },
      ...options,
    });
  };