import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '@/components/ui/card';
import { useShiftsStore } from '@/stores/shifts-store';

interface ShiftSummaryCardProps {
  className?: string;
}

export function ShiftSummaryCard({ className = '' }: ShiftSummaryCardProps) {
  const { userBookings } = useShiftsStore();

  // Calculate statistics
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();

  const shiftsThisMonth = userBookings.filter(booking => {
    const bookingDate = new Date(booking.shift?.shiftDate || '');
    return bookingDate.getMonth() === thisMonth &&
      bookingDate.getFullYear() === thisYear &&
      booking.status === 'completed';
  }).length;

  const totalEarnings = userBookings
    .filter(booking => booking.status === 'completed')
    .reduce((total, booking) => {
      const shift = booking.shift;
      if (shift) {
        return total + (shift.hourlyRate * shift.totalHours);
      }
      return total;
    }, 0);

  const upcomingShifts = userBookings.filter(booking =>
    booking.status === 'confirmed' || booking.status === 'pending'
  ).length;

  return (
    <Card className={`p-4 bg-white ${className}`}>
      <Text className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</Text>

      <View className="flex-row gap-4">
        <View className="flex-1 items-center">
          <Text className="text-2xl font-bold text-blue-600">{shiftsThisMonth}</Text>
          <Text className="text-sm text-gray-600 text-center">Shifts this month</Text>
        </View>

        <View className="flex-1 items-center">
          <View className="flex-row items-center gap-1">
            <Text className="text-2xl font-bold text-green-600">
              {totalEarnings.toLocaleString()}
            </Text>
            <Text className="text-sm text-green-600">RWF</Text>
          </View>
          <Text className="text-sm text-gray-600 text-center">Total earnings</Text>
        </View>

        <View className="flex-1 items-center">
          <Text className="text-2xl font-bold text-purple-600">{upcomingShifts}</Text>
          <Text className="text-sm text-gray-600 text-center">Upcoming shifts</Text>
        </View>
      </View>
    </Card>
  );
}
