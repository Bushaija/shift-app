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
    <View className={`flex-row gap-2 space-x-4 ${className}`}>
      <Card className="flex flex-col gap-2 p-4 bg-white rounded-xl">
        <Text className="text-center text-2xl font-bold text-blue-600">{shiftsThisMonth}</Text>
        <Text className="text-sm text-gray-600">Shifts this month</Text>
      </Card>
      <Card className="flex flex-col gap-2 p-4 bg-white rounded-xl">
        <View className="flex flex-row gap-2 items-center justify-center ">
          <Text className='text-2xl font-bold text-green-600'>{totalEarnings.toLocaleString()}</Text>
          <Text className="text-sm text-green-600">RWF</Text>
        </View>
        <Text className="text-sm text-gray-600">Total earnings</Text>
      </Card>
      <Card className="flex flex-col gap-2 p-4 bg-white rounded-xl">
        <Text className="text-center text-2xl font-bold text-purple-600">{upcomingShifts}</Text>
        <Text className="text-sm text-gray-600">Upcoming shifts</Text>
      </Card>
    </View>
  );
}
