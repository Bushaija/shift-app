import React from 'react';
import { View, Text } from 'react-native';
import { useNotificationsStore } from '@/stores/notifications-store';

interface NotificationBadgeProps {
  count: number;
  className?: string;
}

export function NotificationBadge({ count, className = '' }: NotificationBadgeProps) {
  if (count === 0) return null;

  return (
    <View className={`absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center ${className}`}>
      <Text className="text-white text-xs font-bold">
        {count > 99 ? '99+' : count.toString()}
      </Text>
    </View>
  );
}
