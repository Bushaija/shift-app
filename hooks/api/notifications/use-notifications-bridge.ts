import { useNotificationsCenter } from "./use-notifications-center";

export function useNotifications() {
  const center = useNotificationsCenter();
  return {
    notifications: center.notifications,
    unreadCount: center.unreadCount,
    markAsRead: center.markAsRead,
    markAllAsRead: center.markAllAsRead,
    refresh: center.refresh,
    isLoading: center.isLoading,
  } as const;
}


