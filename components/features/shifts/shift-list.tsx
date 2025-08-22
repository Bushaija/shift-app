import React from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { ShiftCard } from './shift-card';
import { useShiftsStore } from '@/stores/shifts-store';
import { Briefcase, Search, Filter, Plus } from 'lucide-react-native';

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
        <View className="bg-red-50 p-6 rounded-2xl border border-red-200 items-center">
          <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
            <Briefcase size={32} color="#DC2626" />
          </View>
          <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
            Error Loading Shifts
          </Text>
          <Text className="text-gray-600 text-center mb-6 max-w-xs">
            {error}
          </Text>
          <TouchableOpacity
            className="bg-red-600 px-6 py-3 rounded-xl shadow-lg shadow-red-200"
            onPress={onRefresh}
          >
            <Text className="text-white font-semibold text-base">Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (filteredShifts.length === 0 && !isLoading) {
    return (
      <View className={`flex-1 justify-center items-center p-8 ${className}`}>
        <View className="bg-gray-50 p-8 rounded-2xl border border-gray-200 items-center max-w-sm">
          <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-6">
            <Briefcase size={40} color="#9CA3AF" />
          </View>
          <Text className="text-xl font-bold text-gray-900 mb-3 text-center">
            No Shifts Found
          </Text>
          <Text className="text-gray-600 text-center mb-6 leading-6">
            We couldn't find any shifts matching your current filters. Try adjusting your search criteria or check back later for new opportunities.
          </Text>

          <View className="space-y-3 w-full">
            <TouchableOpacity className="bg-blue-600 px-6 py-3 rounded-xl shadow-lg shadow-blue-200">
              <Text className="text-white font-semibold text-base text-center">
                Clear Filters
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 px-6 py-3 rounded-xl border border-gray-200">
              <Text className="text-gray-700 font-medium text-center">
                Browse All Shifts
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${className}`}>
      {/* Results Header */}
      
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text className="text-lg font-semibold text-gray-900">
            {filteredShifts.length} Shift{filteredShifts.length !== 1 ? 's' : ''} Available
          </Text>
          <Text className="text-gray-600 text-sm">
            {isLoading ? 'Loading...' : 'Tap on a shift to view details'}
          </Text>
        </View>

        {filteredShifts.length > 0 && (
          <View className="flex-row items-center gap-2">
            <View className="bg-green-100 px-3 py-1.5 rounded-full">
              <Text className="text-green-700 text-xs font-medium">
                {filteredShifts.filter(s => s.isUrgent).length} Urgent
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Shifts List */}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="space-y-4">
          {filteredShifts.map((shift, index) => (
            <View key={shift.id}>
              <ShiftCard shift={shift} />
              {index < filteredShifts.length - 1 && (
                <View className="h-4" />
              )}
            </View>
          ))}
        </View>

        {/* End of List Indicator */}
        {filteredShifts.length > 0 && (
          <View className="items-center py-6">
            <View className="w-16 h-px bg-gray-200 mb-4" />
            <Text className="text-gray-500 text-sm">
              You've reached the end of available shifts
            </Text>
            <Text className="text-gray-400 text-xs mt-1">
              Pull down to refresh for new opportunities
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
