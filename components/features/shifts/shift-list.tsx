import React from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { ShiftCard } from './shift-card';
import { useShiftsStore } from '@/stores/shifts-store';
import { Briefcase } from 'lucide-react-native';

interface ShiftListProps {
  className?: string;
}

export function ShiftList({ className = '' }: ShiftListProps) {
  const { filteredShifts, isLoading, error, fetchAvailableShifts } = useShiftsStore();

  const onRefresh = () => {
    fetchAvailableShifts();
  };

  if (error) {
    return (
      <View className={`flex-1 justify-center items-center p-8 ${className}`}>
        <Text className="text-lg font-medium text-gray-900 mb-2">Error loading shifts</Text>
        <Text className="text-gray-600 text-center mb-4">{error}</Text>
        <TouchableOpacity
          className="bg-blue-600 px-4 py-2 rounded-lg"
          onPress={onRefresh}
        >
          <Text className="text-white font-medium">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (filteredShifts.length === 0 && !isLoading) {
    return (
      <View className={`flex-1 justify-center items-center p-8 ${className}`}>
        <Briefcase size={48} color="#9CA3AF" />
        <Text className="text-lg font-medium text-gray-900 mt-4">
          No shifts found
        </Text>
        <Text className="text-gray-600 text-center mt-2">
          Try adjusting your filters or check back later for new opportunities.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className={`flex-1 ${className}`}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      <View className="space-y-4 flex flex-col gap-4">
        {filteredShifts.map((shift) => (
          <ShiftCard key={shift.id} shift={shift} />
        ))}
      </View>
    </ScrollView>
  );
}
