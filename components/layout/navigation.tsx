import React from 'react';
import { NotificationBadge as EnhancedNotificationBadge } from '@/components/features/notifications';

interface NotificationBadgeProps {
  count: number;
  className?: string;
}

export function NotificationBadge({ count, className = '' }: NotificationBadgeProps) {
  if (count === 0) return null;

  return (
    <EnhancedNotificationBadge
      showCount={true}
      size="medium"
      className={className}
    />
  );
}
