import React from 'react';
import { View, Text } from 'react-native';
import { useNotificationsStore } from '@/stores/notifications-store';

interface NotificationBadgeProps {
  showCount?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function NotificationBadge({
  showCount = true,
  size = 'medium',
  className = ''
}: NotificationBadgeProps) {
  const { unreadCount, urgentCount } = useNotificationsStore();

  if (unreadCount === 0) return null;

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'w-4 h-4',
          text: 'text-xs',
          minWidth: 'min-w-[16px]'
        };
      case 'large':
        return {
          container: 'w-6 h-6',
          text: 'text-sm',
          minWidth: 'min-w-[24px]'
        };
      default: // medium
        return {
          container: 'w-5 h-5',
          text: 'text-xs',
          minWidth: 'min-w-[20px]'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <View className={`absolute -top-1 -right-1 ${sizeClasses.container} ${sizeClasses.minWidth} ${className}`}>
      <View className={`${sizeClasses.container} bg-red-500 rounded-full items-center justify-center border-2 border-white shadow-sm`}>
        {showCount && unreadCount > 0 && (
          <Text className={`${sizeClasses.text} text-white font-bold`}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        )}
      </View>

      {/* Urgent indicator dot */}
      {urgentCount > 0 && (
        <View className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-orange-500 rounded-full border border-white" />
      )}
    </View>
  );
}
