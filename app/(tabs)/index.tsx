import React, { useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GreetingHeader } from '@/components/features/home/greeting-header';
import { ShiftSummaryCard } from '@/components/features/home/shift-summary-card';
import { WalletSummary } from '@/components/features/home/wallet-summary';
import { useShiftsStore } from '@/stores/shifts-store';

export default function HomeScreen() {
  const { fetchAvailableShifts, fetchUserBookings } = useShiftsStore();

  useEffect(() => {
    // Load data when component mounts
    fetchAvailableShifts();
    fetchUserBookings();
  }, [fetchAvailableShifts, fetchUserBookings]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="p-4 flex flex-col gap-4">

          {/* Header */}
          <GreetingHeader />

          {/* Quick Stats */}
          <ShiftSummaryCard />

          {/* Available Shifts & Recent Activity */}
          <WalletSummary />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
