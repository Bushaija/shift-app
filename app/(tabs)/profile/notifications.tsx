import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NotificationCard } from '@/components/features/notifications/notification-card';
import { useNotifications } from '@/hooks/api/notifications/use-notifications-bridge';
import { Bell, Check, Filter, Trash2, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';

export default function NotificationsScreen() {
  const { notifications, unreadCount, markAllAsRead, refresh, isLoading } = useNotifications();

  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  };

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.isRead);
      case 'urgent':
        return notifications.filter(n => n.priority === 'high');
      default:
        return notifications;
    }
  };

  const filteredNotifications = getFilteredNotifications();

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  const handleClearAll = () => {
    // Optional: implement delete-all API if available
  };

  const getFilterButtonStyle = (filterType: 'all' | 'unread' | 'urgent') => ({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: filter === filterType ? '#2563EB' : '#E5E7EB',
      backgroundColor: filter === filterType ? '#2563EB' : '#FFFFFF',
    },
    text: {
      fontSize: 14,
      fontWeight: filter === filterType ? '600' as const : '500' as const,
      color: filter === filterType ? '#FFFFFF' : '#4B5563',
      textAlign: 'center' as const,
    }
  });

  if (notifications.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center p-8">
          <View className="bg-white p-8 rounded-2xl border border-gray-200 items-center max-w-sm">
            <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-6">
              <Bell size={40} color="#9CA3AF" />
            </View>
            <Text className="text-xl font-bold text-gray-900 mb-3 text-center">
              No Notifications
            </Text>
            <Text className="text-gray-600 text-center mb-6 leading-6">
              You're all caught up! New notifications will appear here when they arrive.
            </Text>

            <TouchableOpacity
              className="bg-blue-600 px-6 py-3 rounded-xl shadow-lg shadow-blue-200"
              onPress={onRefresh}
            >
              <Text className="text-white font-semibold text-base text-center">
                Refresh
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1">
        {/* Header */}
        <View className="p-4 bg-white border-b border-gray-200">
          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="p-2 -ml-2"
            >
              <ArrowLeft size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-gray-900 ml-2">
              Notifications
            </Text>
          </View>

          <Text className="text-gray-600 mb-4">
            Stay updated with important updates and reminders
          </Text>

          {/* Stats Row */}
          <View className="flex-row gap-3 mt-4">
            <View className="flex-1 bg-blue-50 p-3 rounded-lg border border-blue-200">
              <Text className="text-2xl font-bold text-blue-600">
                {notifications.length}
              </Text>
              <Text className="text-sm text-blue-700">Total</Text>
            </View>
            {/* Urgent count can be derived from notifications if needed */}
            <View className="flex-1 bg-red-50 p-3 rounded-lg border border-red-200">
              <Text className="text-2xl font-bold text-red-600">
                {notifications.filter(n => (n.priority === 'urgent' || n.priority === 'high')).length}
              </Text>
              <Text className="text-sm text-red-700">Urgent</Text>
            </View>
            <View className="flex-1 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <Text className="text-2xl font-bold text-yellow-600">
                {unreadCount}
              </Text>
              <Text className="text-sm text-yellow-700">Unread</Text>
            </View>
          </View>

          {/* Filter Tabs */}
          <View className="flex-row bg-gray-100 rounded-lg p-1 mt-4">
            <TouchableOpacity
              className="flex-1 py-2 px-4 rounded-md"
              style={getFilterButtonStyle('all').container}
              onPress={() => setFilter('all')}
            >
              <Text style={getFilterButtonStyle('all').text}>
                All ({notifications.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-2 px-4 rounded-md"
              style={getFilterButtonStyle('unread').container}
              onPress={() => setFilter('unread')}
            >
              <Text style={getFilterButtonStyle('unread').text}>
                Unread ({unreadCount})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-2 px-4 rounded-md"
              style={getFilterButtonStyle('urgent').container}
              onPress={() => setFilter('urgent')}
            >
              <Text style={getFilterButtonStyle('urgent').text}>
                Urgent ({notifications.filter(n => (n.priority === 'urgent' || n.priority === 'high')).length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View className="flex-1 px-4 py-4">
          {/* Action Buttons */}
          <View className="flex-row gap-3 mb-4">
            <TouchableOpacity
              className="flex-1 bg-blue-600 px-4 py-3 rounded-xl shadow-lg shadow-blue-200 flex-row items-center justify-center"
              onPress={handleMarkAllRead}
              disabled={unreadCount === 0}
            >
              <Check size={18} color="#FFFFFF" />
              <Text className="text-white font-semibold ml-2">
                Mark All Read
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 flex-row items-center justify-center"
              onPress={handleClearAll}
            >
              <Trash2 size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Notifications List */}
          <ScrollView
            className="flex-1"
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                colors={['#3B82F6']}
                tintColor="#3B82F6"
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <View className="space-y-3">
              {filteredNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </View>

            {/* End of List Indicator */}
            {filteredNotifications.length > 0 && (
              <View className="items-center py-6">
                <View className="w-16 h-px bg-gray-200 mb-4" />
                <Text className="text-gray-500 text-sm">
                  You've reached the end of notifications
                </Text>
                <Text className="text-gray-400 text-xs mt-1">
                  Pull down to refresh
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

