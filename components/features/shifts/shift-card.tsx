import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/card';
import { MapPin, Clock, DollarSign } from 'lucide-react-native';
import { Shift } from '@/stores/shifts-store';
import { useShiftsStore } from '@/stores/shifts-store';
import { router } from 'expo-router';

interface ShiftCardProps {
  shift: Shift;
  onApply?: (shiftId: string) => void;
  className?: string;
}

export function ShiftCard({ shift, onApply, className = '' }: ShiftCardProps) {
  const { applyForShift, isLoading } = useShiftsStore();

  const handleApply = async () => {
    if (onApply) {
      onApply(shift.id);
    } else {
      await applyForShift(shift.id);
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

  return (
    <TouchableOpacity onPress={() => router.push(`/(tabs)/shifts/${shift.id}`)}>
      <Card className={`p-4 bg-white rounded-xl ${className}`}>
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-900">{shift.title}</Text>
            <Text className="text-gray-500">{shift.facilityName}</Text>
          </View>
          {shift.isUrgent && (
            <View className="bg-red-100 px-2 py-1 rounded">
              <Text className="text-red-600 text-xs font-medium">URGENT</Text>
            </View>
          )}
        </View>

        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            {/* <DollarSign size={16} color="#10B981" /> */}
            <Text className="text-xl font-bold text-green-600 ml-1">
              RWF {shift.hourlyRate}/hr
            </Text>
          </View>
          <Text className="text-gray-600">{shift.totalHours} hours</Text>
        </View>

        <View className="space-y-2 mb-3">
          <View className="flex-row items-center">
            <Clock size={16} color="#6B7280" />
            <Text className="ml-2 text-gray-600">
              {formatDate(shift.shiftDate)}, {formatTime(shift.startTime, shift.endTime)}
            </Text>
          </View>

          {shift.location && (
            <View className="flex-row items-center">
              <MapPin size={16} color="#6B7280" />
              <Text className="ml-2 text-gray-600">{shift.location}</Text>
              {shift.distance && (
                <Text className="ml-2 text-gray-500">({shift.distance} mi away)</Text>
              )}
            </View>
          )}
        </View>

        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <View className="bg-blue-100 px-2 py-1 rounded">
              <Text className="text-blue-600 text-xs font-medium">{shift.licenseType}</Text>
            </View>
            <Text className="ml-2 text-gray-500 text-sm">{shift.department}</Text>
          </View>

          <TouchableOpacity
            className="bg-blue-600 px-4 py-2 rounded-lg"
            onPress={handleApply}
            disabled={isLoading}
          >
            <Text className="text-white font-medium">
              {isLoading ? 'Applying...' : 'Apply'}
            </Text>
          </TouchableOpacity>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
