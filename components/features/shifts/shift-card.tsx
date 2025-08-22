import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/card';
import { MapPin, Clock, DollarSign, Calendar, Star, AlertTriangle } from 'lucide-react-native';
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

  const getUrgencyColor = () => {
    if (shift.isUrgent) return 'bg-red-500';
    return 'bg-green-500';
  };

  return (
    <TouchableOpacity onPress={() => router.push(`/(tabs)/shifts/${shift.id}`)}>
      <Card className={`p-5 bg-white rounded-2xl border border-gray-200 shadow-sm ${className}`}>
        {/* Header with Title and Urgency */}
        <View className="flex-row justify-between items-start mb-4">
          <View className="flex-1 pr-3">
            <Text className="text-lg font-bold text-gray-900 mb-1">{shift.title}</Text>
            <Text className="text-gray-600 font-medium">{shift.facilityName}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            {shift.isUrgent && (
              <View className="bg-red-100 px-3 py-1.5 rounded-full border border-red-200">
                <View className="flex-row items-center">
                  <AlertTriangle size={14} color="#DC2626" />
                  <Text className="text-red-600 text-xs font-bold ml-1">URGENT</Text>
                </View>
              </View>
            )}
            <View className={`w-3 h-3 rounded-full ${getUrgencyColor()}`} />
          </View>
        </View>

        {/* Rate and Hours */}
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            <DollarSign size={20} color="#10B981" />
            <Text className="text-2xl font-bold text-green-600 ml-2">
              RWF {shift.hourlyRate.toLocaleString()}
            </Text>
            <Text className="text-gray-500 ml-1">/hr</Text>
          </View>
          <View className="bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
            <Text className="text-blue-700 font-semibold">{shift.totalHours}h</Text>
          </View>
        </View>

        {/* Shift Details */}
        <View className="space-y-3 mb-4">
          <View className="flex-row items-center">
            <Calendar size={18} color="#6B7280" />
            <Text className="ml-3 text-gray-700 font-medium">
              {formatDate(shift.shiftDate)}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Clock size={18} color="#6B7280" />
            <Text className="ml-3 text-gray-700 font-medium">
              {formatTime(shift.startTime, shift.endTime)}
            </Text>
          </View>

          {shift.location && (
            <View className="flex-row items-center">
              <MapPin size={18} color="#6B7280" />
              <Text className="ml-3 text-gray-700 font-medium">{shift.location}</Text>
              {shift.distance && (
                <Text className="ml-2 text-gray-500">({shift.distance} mi away)</Text>
              )}
            </View>
          )}
        </View>

        {/* Requirements and Actions */}
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-2">
            <View className="bg-blue-100 px-3 py-2 rounded-lg border border-blue-200">
              <Text className="text-blue-700 text-sm font-semibold">{shift.licenseType}</Text>
            </View>
            <View className="bg-green-100 px-3 py-2 rounded-lg border border-green-200">
              <Text className="text-green-700 text-sm font-semibold">{shift.department}</Text>
            </View>
          </View>

          <TouchableOpacity
            className={`px-6 py-3 rounded-xl ${shift.isUrgent
                ? 'bg-red-600 shadow-lg shadow-red-200'
                : 'bg-blue-600 shadow-lg shadow-blue-200'
              }`}
            onPress={handleApply}
            disabled={isLoading}
          >
            <Text className="text-white font-semibold text-base">
              {isLoading ? 'Applying...' : shift.isUrgent ? 'Apply Now' : 'Apply'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Additional Info */}
        {shift.isUrgent && (
          <View className="mt-4 pt-3 border-t border-gray-100">
            <View className="flex-row items-center justify-center">
              <Star size={16} color="#F59E0B" />
              <Text className="text-amber-600 text-sm font-medium ml-2">
                High priority shift - Quick response needed
              </Text>
            </View>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
}
