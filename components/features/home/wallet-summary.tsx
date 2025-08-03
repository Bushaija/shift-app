
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/card';
import { useShiftsStore } from '@/stores/shifts-store';
import { router } from 'expo-router';

interface WalletSummaryProps {
  className?: string;
}

export function WalletSummary({ className = '' }: WalletSummaryProps) {
  const { availableShifts, userBookings } = useShiftsStore();

  // Get recent activity (last 3 bookings)
  const recentActivity = userBookings
    .sort((a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime())
    .slice(0, 3);

  // Get top available shifts
  const topShifts = availableShifts
    .filter(shift => shift.status === 'open')
    .sort((a, b) => b.hourlyRate - a.hourlyRate)
    .slice(0, 2);

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getActivityIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '✅';
      case 'pending':
        return '⏳';
      case 'completed':
        return '💰';
      case 'cancelled':
        return '❌';
      default:
        return '📋';
    }
  };

  return (
    <View className={`flex flex-col gap-4 ${className}`}>
      {/* Available Shifts */}
      <Card className="p-6 bg-white rounded-xl border-none">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold text-gray-900">
            Available Shifts
          </Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/shifts')}>
            <Text className="text-blue-600 font-medium">View all</Text>
          </TouchableOpacity>
        </View>
        <View className="flex flex-col gap-2 space-y-3">
          {topShifts.map((shift) => (
            <View key={shift.id} className="flex-row justify-between items-center p-3 bg-blue-50 rounded-lg">
              <View>
                <Text className="font-medium text-gray-900">{shift.title}</Text>
                <Text className="text-sm text-gray-600">{shift.facilityName}</Text>
              </View>
              <Text className="font-semibold text-blue-600">RWF {shift.hourlyRate}/hr</Text>
            </View>
          ))}
          {topShifts.length === 0 && (
            <View className="p-3 bg-gray-50 rounded-lg">
              <Text className="text-gray-600 text-center">No available shifts</Text>
            </View>
          )}
        </View>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6 bg-white rounded-xl">
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </Text>
        <View className="flex flex-col gap-4 space-y-3">
          {recentActivity.map((activity) => (
            <View key={activity.id} className="flex-row gap-2 items-start space-x-3">
              <Text className="text-lg">{getActivityIcon(activity.status)}</Text>
              <Text className="flex-1 text-gray-700">
                {activity.status === 'confirmed' && `Shift confirmed for ${activity.shift?.title}`}
                {activity.status === 'pending' && `Applied for ${activity.shift?.title}`}
                {activity.status === 'completed' && `Completed shift at ${activity.shift?.facilityName}`}
                {activity.status === 'cancelled' && `Cancelled shift at ${activity.shift?.facilityName}`}
              </Text>
              <Text className="text-sm text-gray-500">
                {getTimeAgo(activity.bookedAt)}
              </Text>
            </View>
          ))}
          {recentActivity.length === 0 && (
            <View className="items-center py-4">
              <Text className="text-gray-600">No recent activity</Text>
            </View>
          )}
        </View>
      </Card>
    </View>
  );
}
