import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/card';
import { SlideUpView } from '@/components/ui/animations';
import { useNotificationsCenter } from '@/hooks/api/notifications/use-notifications-center';

interface NotificationsPanelProps {
  className?: string;
  limit?: number;
}

export function NotificationsPanel({ className = '', limit = 5 }: NotificationsPanelProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading, refresh } = useNotificationsCenter();
  console.log("notifications: ", notifications)

  const items = (notifications || []).slice(0, limit);

  return (
    <SlideUpView duration={400} delay={350}>
      <Card className={`p-4 ${className}`}>
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-gray-900 font-semibold">Notifications</Text>
          <View className="flex-row items-center gap-4">
            <Text className="text-gray-600">Unread: {unreadCount || 0}</Text>
            <TouchableOpacity onPress={markAllAsRead} disabled={unreadCount === 0}>
              <Text className={`font-medium ${unreadCount ? 'text-blue-600' : 'text-gray-400'}`}>Mark all read</Text>
            </TouchableOpacity>
          </View>
        </View>

        {isLoading ? (
          <Text className="text-gray-500">Loading...</Text>
        ) : items.length === 0 ? (
          <Text className="text-gray-500">No notifications</Text>
        ) : (
          <View className="flex flex-col gap-3">
            {items.map((n: any) => (
              <View key={n.notificationId ?? n.notification_id ?? n.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-gray-900 font-medium">{n.title || n.category || 'Notification'}</Text>
                  {!((n.is_read ?? n.isRead) === true) && (
                    <TouchableOpacity onPress={() => markAsRead(n.notificationId ?? n.notification_id ?? n.id)}>
                      <Text className="text-xs text-blue-600">Mark read</Text>
                    </TouchableOpacity>
                  )}
                </View>
                {n.message ? (
                  <Text className="text-gray-700 text-sm" numberOfLines={3}>{n.message}</Text>
                ) : null}
                <Text className="text-gray-400 text-xs mt-1">{n.priority ? String(n.priority).toUpperCase() : ''}</Text>
              </View>
            ))}
          </View>
        )}
      </Card>
    </SlideUpView>
  );
}


