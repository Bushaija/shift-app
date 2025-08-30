import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ApiError, PaginatedResponse } from "@/types/api";
import { Notification } from "@/types/api";
import { mobileQueryKeys } from "../query-keys";
import { nurseApi } from "@/services/api";

export const useUnreadNotifications = (
    options?: UseQueryOptions<PaginatedResponse<Notification>, ApiError>
  ) => {
    return useQuery({
      queryKey: mobileQueryKeys.notificationsList({ unread_only: true }),
      queryFn: () => nurseApi.notifications.getNotifications({ unread_only: true }),
      refetchInterval: 30000,
      ...options,
    });
  };