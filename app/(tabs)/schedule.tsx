import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, MapPin, X, Plus, Minus } from 'lucide-react-native';
import { useShiftsStore } from '@/stores/shifts-store';
import { useAuthStore } from '@/stores/auth-store';
import { apiClient } from '@/services/api/client';
import { startOfWeek, endOfWeek, format } from 'date-fns';

export default function ScheduleScreen() {
  const [activeTab, setActiveTab] = useState('schedule');
  const { isLoading } = useShiftsStore();
  const nurse = useAuthStore(state => state.nurse);
  const [weekShifts, setWeekShifts] = useState<any[]>([]);
  const [weekStart, setWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [weekEnd, setWeekEnd] = useState<Date>(endOfWeek(new Date(), { weekStartsOn: 1 }));

  useEffect(() => {
    fetchWeekShifts();
    // eslint-disable-next-line
  }, [nurse, weekStart, weekEnd]);

  const fetchWeekShifts = async () => {
    if (!nurse?.worker_id) return;
    const startDate = format(weekStart, 'yyyy-MM-dd');
    const endDate = format(weekEnd, 'yyyy-MM-dd');
    try {
      const response = await apiClient.get<any>(`/shifts?nurseId=${nurse.worker_id}&startDate=${startDate}&endDate=${endDate}`);
      setWeekShifts(response.data || []);
    } catch (error) {
      setWeekShifts([]);
    }
  };

  // Map API data to weekly schedule grid (Mon-Sun)
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklySchedule = daysOfWeek.map((day, idx) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + idx);
    const dateStr = format(date, 'yyyy-MM-dd');
    const shift = weekShifts.find(s => s.startTime.startsWith(dateStr));
    if (shift) {
      return {
        day,
        status: 'assigned',
        shift: shift.shiftType?.charAt(0).toUpperCase() || 'D',
        shiftObj: shift,
      };
    } else {
      return {
        day,
        status: 'available',
        shift: 'OFF',
        shiftObj: null,
      };
    }
  });

  const tabs = [
    { id: 'schedule', label: 'Schedule' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'ongoing', label: 'Ongoing' },
    { id: 'past', label: 'Past' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned':
        return 'bg-blue-500';
      case 'available':
        return 'bg-green-500';
      case 'unavailable':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'assigned':
        return 'text-blue-700';
      case 'available':
        return 'text-green-700';
      case 'unavailable':
        return 'text-red-700';
      default:
        return 'text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const formatTime = (startTime: string, endTime: string) => {
    return `${startTime} - ${endTime}`;
  };

  const renderScheduleView = () => (
    <View className="space-y-6">
      {/* Week Header */}
      <View className="bg-white rounded-xl p-4">
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          Week of {format(weekStart, 'MMMM d, yyyy')} - {format(weekEnd, 'MMMM d, yyyy')}
        </Text>
        {/* Schedule Grid */}
        <View className="space-y-3">
          <View className="flex-row justify-between">
            {daysOfWeek.map((day) => (
              <Text key={day} className="text-sm font-semibold text-gray-700 w-10 text-center">
                {day}
              </Text>
            ))}
          </View>
          <View className="flex-row justify-between">
            {weeklySchedule.map((item, index) => (
              <View key={index} className="w-10 h-10 items-center justify-center">
                <View className={`w-8 h-8 rounded-full ${getStatusColor(item.status)} items-center justify-center`}>
                  <Text className="text-xs font-bold text-white">
                    {item.shift}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Legend */}
      <Card className="p-4 bg-white rounded-xl">
        <Text className="text-base font-semibold text-gray-900 mb-3">Legend:</Text>
        <View className="space-y-2">
          <View className="flex-row items-center">
            <View className="w-4 h-4 bg-blue-500 rounded-full mr-3" />
            <Text className="text-gray-700">Assigned</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-4 h-4 bg-green-500 rounded-full mr-3" />
            <Text className="text-gray-700">Available</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-4 h-4 bg-red-500 rounded-full mr-3" />
            <Text className="text-gray-700">Unavailable</Text>
          </View>
        </View>
      </Card>

      {/* Action Buttons */}
      <View className="flex flex-col gap-4">
        <TouchableOpacity className="bg-green-500 py-3 px-6 rounded-xl flex-row items-center justify-center">
          <Plus size={20} color="white" />
          <Text className="text-white font-semibold ml-2">Set Availability</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-yellow-500 py-3 px-6 rounded-xl flex-row items-center justify-center">
          <Minus size={20} color="white" />
          <Text className="text-white font-semibold ml-2">Request Time Off</Text>
        </TouchableOpacity>
      </View>

      {/* Weekly Summary */}
      <Card className="p-4 bg-white rounded-xl">
        <Text className="text-base font-semibold text-gray-900 mb-3">This Week Summary:</Text>
        <View className="space-y-2">
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Total Hours:</Text>
            <Text className="text-gray-900 font-semibold">36</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Overtime:</Text>
            <Text className="text-gray-900 font-semibold">0</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Break Compliance:</Text>
            <Text className="text-green-600 font-semibold">✅</Text>
          </View>
        </View>
      </Card>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Header */}
          <View className="flex flex-col justify-center items-center mb-6 py-4">
            <Text className="text-2xl font-bold text-gray-900">
              My Schedule
            </Text>
            <Text className="text-gray-600 mt-1">
              Manage your shifts and availability
            </Text>
          </View>

          {/* Tab Navigation (only show schedule tab for now) */}
          <View className="flex-row bg-white rounded-lg p-1 mb-6">
            <TouchableOpacity
              key="schedule"
              onPress={() => setActiveTab('schedule')}
              className={`flex-1 py-2 px-2 rounded-md bg-blue-600`}
            >
              <Text className="text-center font-medium text-white">
                Schedule
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content: Schedule Grid */}
          {renderScheduleView()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
