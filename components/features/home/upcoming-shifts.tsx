import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, MapPin } from 'lucide-react-native';
import { useShiftsStore } from '@/stores/shifts-store';

interface UpcomingShiftsProps {
  className?: string;
}

export function UpcomingShifts({ className = '' }: UpcomingShiftsProps) {
  const { userBookings } = useShiftsStore();

  // Get upcoming shifts for the next 7 days
  const today = new Date();
  const upcomingShifts = userBookings
    .filter(booking => {
      const shiftDate = new Date(booking.shift?.shiftDate || '');
      const daysDiff = Math.ceil((shiftDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff > 0 && daysDiff <= 7 &&
        (booking.status === 'confirmed' || booking.status === 'pending');
    })
    .sort((a, b) => new Date(a.shift?.shiftDate || '').getTime() - new Date(b.shift?.shiftDate || '').getTime())
    .slice(0, 5);

  const getDayLabel = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getShiftType = (startTime: string) => {
    try {
      const [hours] = startTime.split(':');
      const hour = parseInt(hours, 10);
      if (hour >= 6 && hour < 18) return 'Day';
      return 'Night';
    } catch {
      return 'Day'; // fallback
    }
  };

  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeString; // fallback to original string
    }
  };

  if (upcomingShifts.length === 0) {
    return (
      <Card className={`p-4 bg-gray-50 border-gray-200 ${className}`}>
        <View className="flex-row items-center gap-3">
          <Calendar size={20} className="text-gray-400" />
          <View className="flex-1">
            <Text className="text-gray-600 font-medium">No upcoming shifts</Text>
            <Text className="text-gray-500 text-sm">Check back later for new opportunities</Text>
          </View>
        </View>
      </Card>
    );
  }

  return (
    <Card className={`p-4 bg-white ${className}`}>
      <Text className="text-lg font-semibold text-gray-900 mb-4">Upcoming Shifts</Text>

      <View className="flex flex-col gap-3">
        {upcomingShifts.map((booking, index) => {
          const shift = booking.shift;
          if (!shift) return null;

          const shiftDate = new Date(shift.shiftDate);
          const startTime = formatTime(shift.startTime);
          const endTime = formatTime(shift.endTime);

          return (
            <View key={booking.id} className="flex-row items-center justify-between p-3 bg-gray-50 rounded-lg">
              <View className="flex-1">
                <View className="flex-row items-center gap-2 mb-1">
                  <Text className="font-medium text-gray-900">
                    {getDayLabel(shiftDate)}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {shiftDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Text>
                </View>

                <View className="flex-row items-center gap-2">
                  <Clock size={14} className="text-gray-500" />
                  <Text className="text-sm text-gray-700">
                    {startTime} - {endTime} ({getShiftType(shift.startTime)})
                  </Text>
                </View>

                <View className="flex-row items-center gap-2 mt-1">
                  <MapPin size={14} className="text-gray-500" />
                  <Text className="text-sm text-gray-600">{shift.facilityName}</Text>
                </View>
              </View>

              <View className="bg-blue-100 px-2 py-1 rounded">
                <Text className="text-blue-700 text-xs font-medium">
                  {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </Card>
  );
}
