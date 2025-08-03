import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShiftFilters } from '@/components/features/shifts/shift-filters';
import { ShiftList } from '@/components/features/shifts/shift-list';
import { useShiftsStore } from '@/stores/shifts-store';

export default function ShiftsScreen() {
  const { fetchAvailableShifts } = useShiftsStore();

  useEffect(() => {
    // Load shifts when component mounts
    fetchAvailableShifts();
  }, [fetchAvailableShifts]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1">
        <View className="p-4">
          {/* Header */}
          <View className="flex flex-col py-4">
            <Text className="text-xl text-center font-semibold text-gray-900">
              Available Shifts
            </Text>
            <Text className="text-gray-600 text-center mt-1">
              Find your perfect shift
            </Text>
          </View>

          {/* Search and Filter */}
          <ShiftFilters />
        </View>

        {/* Shifts List */}
        <View className="flex-1 px-4 pb-4">
          <ShiftList />
        </View>
      </View>
    </SafeAreaView>
  );
}
