import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNotificationsStore } from '@/stores/notifications-store';
import { Card } from '@/components/ui/card';
import { Bell, Plus, Play } from 'lucide-react-native';

export function NotificationDemo() {
  const {
    notifyUrgentOvertime,
    notifySwapApproved,
    notifyScheduleUpdated,
    notifyBreakReminder,
    notifyBookingConfirmed,
    notifyPaymentReceived,
    clearAll
  } = useNotificationsStore();

  const createSampleNotifications = () => {
    // Clear existing notifications first
    clearAll();

    // Create sample notifications matching the wireframe
    notifyUrgentOvertime('ICU', '6 PM today');
    notifySwapApproved('March 22', 'Sarah M.');
    notifyScheduleUpdated();
    notifyBreakReminder('30-minute');
    notifyBookingConfirmed('Emergency Night Shift', 'City General Hospital');
    notifyPaymentReceived(1250);
  };

  const createSingleNotification = (type: string) => {
    switch (type) {
      case 'urgent':
        notifyUrgentOvertime('Emergency', '2 PM today');
        break;
      case 'swap':
        notifySwapApproved('March 25', 'John D.');
        break;
      case 'schedule':
        notifyScheduleUpdated();
        break;
      case 'break':
        notifyBreakReminder('15-minute');
        break;
      case 'booking':
        notifyBookingConfirmed('ICU Day Shift', 'Memorial Hospital');
        break;
      case 'payment':
        notifyPaymentReceived(850);
        break;
    }
  };

  return (
    <Card className="p-6 bg-white rounded-2xl border border-gray-200 shadow-lg">
      <View className="items-center mb-6">
        <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
          <Bell size={32} color="#3B82F6" />
        </View>
        <Text className="text-xl font-bold text-gray-900 mb-2">
          Notification Demo
        </Text>
        <Text className="text-gray-600 text-center">
          Test different notification types and see how they appear
        </Text>
      </View>

      {/* Bulk Actions */}
      <View className="mb-6">
        <TouchableOpacity
          className="bg-blue-600 px-6 py-3 rounded-xl shadow-lg shadow-blue-200 flex-row items-center justify-center mb-3"
          onPress={createSampleNotifications}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text className="text-white font-semibold ml-2">
            Create All Sample Notifications
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-gray-100 px-6 py-3 rounded-xl border border-gray-200 flex-row items-center justify-center"
          onPress={clearAll}
        >
          <Text className="text-gray-700 font-medium">
            Clear All Notifications
          </Text>
        </TouchableOpacity>
      </View>

      {/* Individual Notification Types */}
      <View>
        <Text className="text-lg font-semibold text-gray-900 mb-3">
          Individual Notification Types
        </Text>

        <View className="grid grid-cols-2 gap-3">
          <TouchableOpacity
            className="bg-red-50 px-4 py-3 rounded-lg border border-red-200"
            onPress={() => createSingleNotification('urgent')}
          >
            <Text className="text-red-700 font-medium text-center">Urgent Overtime</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-green-50 px-4 py-3 rounded-lg border border-green-200"
            onPress={() => createSingleNotification('swap')}
          >
            <Text className="text-green-700 font-medium text-center">Swap Approved</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-blue-50 px-4 py-3 rounded-lg border border-blue-200"
            onPress={() => createSingleNotification('schedule')}
          >
            <Text className="text-blue-700 font-medium text-center">Schedule Update</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-amber-50 px-4 py-3 rounded-lg border border-amber-200"
            onPress={() => createSingleNotification('break')}
          >
            <Text className="text-amber-700 font-medium text-center">Break Reminder</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-emerald-50 px-4 py-3 rounded-lg border border-emerald-200"
            onPress={() => createSingleNotification('booking')}
          >
            <Text className="text-emerald-700 font-medium text-center">Booking Confirmed</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-purple-50 px-4 py-3 rounded-lg border border-purple-200"
            onPress={() => createSingleNotification('payment')}
          >
            <Text className="text-purple-700 font-medium text-center">Payment Received</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Instructions */}
      <View className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <Text className="text-sm text-gray-600 text-center leading-5">
          💡 <Text className="font-medium">Tip:</Text> After creating notifications, navigate to the Notifications tab to see them in action. Each notification type has different styling and priority levels.
        </Text>
      </View>
    </Card>
  );
}
