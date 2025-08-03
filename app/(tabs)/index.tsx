import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GreetingHeader } from '@/components/features/home/greeting-header';
import { ShiftSummaryCard } from '@/components/features/home/shift-summary-card';
import { WalletSummary } from '@/components/features/home/wallet-summary';
import { useShiftsStore } from '@/stores/shifts-store';
import { SkeletonCard, SkeletonShiftCard } from '@/components/ui/skeleton';
import { ErrorDisplay } from '@/components/ui/error-boundary';
import { FadeInView, SlideUpView } from '@/components/ui/animations';

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { fetchAvailableShifts, fetchUserBookings, isLoading: shiftsLoading, error: shiftsError } = useShiftsStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await Promise.all([
          fetchAvailableShifts(),
          fetchUserBookings()
        ]);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load data'));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchAvailableShifts, fetchUserBookings]);

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    // Reload data
    Promise.all([
      fetchAvailableShifts(),
      fetchUserBookings()
    ]).finally(() => setIsLoading(false));
  };

  if (error || shiftsError) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center px-6">
          <ErrorDisplay
            error={error || (shiftsError ? new Error(shiftsError) : null)}
            onRetry={handleRetry}
            title="Failed to load data"
            message="We couldn't load your dashboard. Please check your connection and try again."
          />
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading || shiftsLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView className="flex-1">
          <View className="p-4 flex flex-col gap-4">
            {/* Development Note */}
            {/* <View className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Text className="text-yellow-800 text-sm text-center">
                🚧 Development Mode - Direct to Home Screen
              </Text>
            </View> */}

            {/* Skeleton Loading */}
            <SkeletonCard />
            <SkeletonShiftCard />
            <SkeletonShiftCard />
            <SkeletonCard />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="p-4 flex flex-col gap-4">
          {/* Development Note */}
          {/* <View className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <Text className="text-yellow-800 text-sm text-center">
              🚧 Development Mode - Direct to Home Screen
            </Text>
          </View> */}

          {/* Header */}
          <FadeInView duration={400}>
            <GreetingHeader />
          </FadeInView>

          {/* Quick Stats */}
          <SlideUpView duration={400} delay={100}>
            <ShiftSummaryCard />
          </SlideUpView>

          {/* Available Shifts & Recent Activity */}
          <SlideUpView duration={400} delay={200}>
            <WalletSummary />
          </SlideUpView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
