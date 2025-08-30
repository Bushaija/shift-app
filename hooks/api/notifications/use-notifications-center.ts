import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNotifications as useNotificationsQuery } from "./use-notifications";
import { useUnreadNotifications } from "./use-unread-notifications";
import { useMarkNotificationRead } from "./use-mark-notification-read";
import { useMarkAllNotificationsRead } from "./use-mark-all-notirification-read";
import { mobileQueryKeys } from "../query-keys";
import { useAuthStore } from "@/stores/auth-store";

export interface UseNotificationsCenterResult {
  notifications: any[];
  unreadCount: number;
  markAsRead: (notificationId: number) => void;
  markAllAsRead: () => void;
  unreadUrgentCount: number;
  unreadUrgent: any[];
  markAllUrgentAsRead: () => void;
  refresh: () => void;
  isLoading: boolean;
}

export function useNotificationsCenter(): UseNotificationsCenterResult {
  const queryClient = useQueryClient();
  const { nurse } = useAuthStore();
  const userId = nurse?.user?.user_id ?? nurse?.user?.id ?? 0;

  const { data: allResp, isLoading: loadingAll } = useNotificationsQuery(
    { limit: 20 },
    { staleTime: 30_000 } as any
  );
  const { data: unreadResp, isLoading: loadingUnread } = useUnreadNotifications();
  const { data: urgentUnreadResp, isLoading: loadingUrgentUnread } = useNotificationsQuery(
    { unread_only: true, priority: 'urgent' } as any,
    { staleTime: 30_000 } as any
  );

  const markOne = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: mobileQueryKeys.notifications });
  };

  const value = useMemo<UseNotificationsCenterResult>(() => {
    const notifications = allResp?.data ?? [];
    const unreadFromAll = notifications.filter((n: any) => (n.is_read ?? n.isRead) === false).length;
    const unreadCount =
      (unreadResp as any)?.pagination?.total ?? (unreadResp as any)?.meta?.total ?? (unreadResp as any)?.data?.length ?? unreadFromAll;
    const unreadUrgent = urgentUnreadResp?.data ?? [];
    const unreadUrgentCount = unreadUrgent.length;
    return {
      notifications,
      unreadCount,
      markAsRead: (id: number) => markOne.mutate(id),
      markAllAsRead: () => {
        if (!userId) return;
        markAll.mutate({ userId, category: '' });
      },
      unreadUrgentCount,
      unreadUrgent,
      markAllUrgentAsRead: () => {
        if (!userId) return;
        markAll.mutate({ userId, category: 'urgent' });
      },
      refresh,
      isLoading: loadingAll || loadingUnread || loadingUrgentUnread,
    };
  }, [allResp, unreadResp, urgentUnreadResp, loadingAll, loadingUnread, loadingUrgentUnread, markOne, markAll, userId]);

  return value;
}


