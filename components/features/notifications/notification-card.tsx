import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/card';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Briefcase,
  DollarSign,
  X,
  Bell
} from 'lucide-react-native';
import { Notification } from '@/stores/notifications-store';
import { useNotificationsStore } from '@/stores/notifications-store';

interface NotificationCardProps {
  notification: Notification;
  onPress?: () => void;
  className?: string;
}

export function NotificationCard({ notification, onPress, className = '' }: NotificationCardProps) {
  const { markAsRead, removeNotification } = useNotificationsStore();

  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'urgent':
        return <AlertTriangle size={20} color="#DC2626" />;
      case 'swap_approved':
        return <CheckCircle size={20} color="#059669" />;
      case 'schedule_updated':
        return <Calendar size={20} color="#3B82F6" />;
      case 'break_reminder':
        return <Clock size={20} color="#F59E0B" />;
      case 'booking_confirmed':
        return <CheckCircle size={20} color="#059669" />;
      case 'booking_pending':
        return <Clock size={20} color="#3B82F6" />;
      case 'booking_cancelled':
        return <X size={20} color="#DC2626" />;
      case 'payment_received':
        return <DollarSign size={20} color="#10B981" />;
      default:
        return <Bell size={20} color="#6B7280" />;
    }
  };

  const getNotificationStyle = () => {
    switch (notification.type) {
      case 'urgent':
        return {
          container: 'bg-red-50 border-red-200',
          title: 'text-red-800',
          message: 'text-red-700',
          badge: 'bg-red-100 border-red-300',
          badgeText: 'text-red-700',
        };
      case 'swap_approved':
        return {
          container: 'bg-green-50 border-green-200',
          title: 'text-green-800',
          message: 'text-green-700',
          badge: 'bg-green-100 border-green-300',
          badgeText: 'text-green-700',
        };
      case 'schedule_updated':
        return {
          container: 'bg-blue-50 border-blue-200',
          title: 'text-blue-800',
          message: 'text-blue-700',
          badge: 'bg-blue-100 border-blue-300',
          badgeText: 'text-blue-700',
        };
      case 'break_reminder':
        return {
          container: 'bg-amber-50 border-amber-200',
          title: 'text-amber-800',
          message: 'text-amber-700',
          badge: 'bg-amber-100 border-amber-300',
          badgeText: 'text-amber-700',
        };
      default:
        return {
          container: 'bg-gray-50 border-gray-200',
          title: 'text-gray-800',
          message: 'text-gray-700',
          badge: 'bg-gray-100 border-gray-300',
          badgeText: 'text-gray-700',
        };
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleMarkAsRead = () => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  const handleRemove = () => {
    removeNotification(notification.id);
  };

  const styles = getNotificationStyle();

  return (
    <TouchableOpacity onPress={onPress || handleMarkAsRead}>
      <Card className={`p-4 border-2 ${styles.container} ${className}`}>
        {/* Header with Icon and Actions */}
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-row items-center flex-1">
            <View className="mr-3">
              {getNotificationIcon()}
            </View>
            <View className="flex-1">
              <Text className={`text-base font-bold ${styles.title} mb-1`}>
                {notification.title}
              </Text>
              <Text className={`text-sm ${styles.message} leading-5`}>
                {notification.message}
              </Text>
            </View>
          </View>

          {/* Priority Badge */}
          <View className={`px-2 py-1 rounded-full border ${styles.badge} ml-2`}>
            <Text className={`text-xs font-medium ${styles.badgeText}`}>
              {notification.priority === 'high' ? 'High' :
                notification.priority === 'medium' ? 'Medium' : 'Low'}
            </Text>
          </View>
        </View>

        {/* Footer with Time and Actions */}
        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-gray-500">
            {formatTimeAgo(notification.createdAt)}
          </Text>

          <View className="flex-row items-center gap-2">
            {notification.actionRequired && (
              <View className="bg-orange-100 px-2 py-1 rounded-full border border-orange-200">
                <Text className="text-orange-700 text-xs font-medium">Action Required</Text>
              </View>
            )}

            {!notification.isRead && (
              <View className="w-2 h-2 bg-blue-500 rounded-full" />
            )}

            <TouchableOpacity
              onPress={handleRemove}
              className="p-1"
            >
              <X size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Expiration Warning */}
        {notification.expiresAt && new Date(notification.expiresAt) < new Date() && (
          <View className="mt-3 pt-3 border-t border-red-200">
            <Text className="text-red-600 text-xs font-medium text-center">
              ⏰ This notification has expired
            </Text>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
}
