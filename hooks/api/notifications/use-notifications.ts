import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ApiError, PaginatedResponse } from "@/types/api";
import { Notification } from "@/types/api";
import { mobileQueryKeys } from "../query-keys";
import { nurseApi } from "@/services/api";
import { NotificationFilters } from "@/types/api";

export const useNotifications = (
    filters?: NotificationFilters,
    options?: UseQueryOptions<PaginatedResponse<Notification>, ApiError>
  ) => {
    return useQuery({
      queryKey: mobileQueryKeys.notificationsList(filters),
      queryFn: () => nurseApi.notifications.getNotifications(filters),
      ...options,
    });
  };