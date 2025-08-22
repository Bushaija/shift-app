import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GreetingHeader } from '@/components/features/home/greeting-header';
import { OvertimeAlert } from '@/components/features/home/overtime-alert';
import { TodaysShiftCard } from '@/components/features/home/todays-shift-card';
import { QuickActions } from '@/components/features/home/quick-actions';
import { UpcomingShifts } from '@/components/features/home/upcoming-shifts';
import { ShiftSummaryCard } from '@/components/features/home/shift-summary-card';
import { NotificationDemo } from '@/components/features/notifications/notification-demo';
import { useShiftsStore } from '@/stores/shifts-store';
import { useNotificationDemo } from '@/hooks/useNotificationDemo';
import { SkeletonCard, SkeletonShiftCard } from '@/components/ui/skeleton';
import { ErrorDisplay } from '@/components/ui/error-boundary';
import { FadeInView, SlideUpView } from '@/components/ui/animations';

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { fetchAvailableShifts, fetchUserBookings, isLoading: shiftsLoading, error: shiftsError } = useShiftsStore();

  // Demo notification system
  useNotificationDemo();

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

  const handleClockIn = () => {
    // TODO: Implement clock in functionality
    console.log('Clock in pressed');
  };

  const handleRequestSwap = () => {
    // TODO: Implement swap request functionality
    console.log('Request swap pressed');
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
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4 flex flex-col gap-4">
          {/* Header */}
          <FadeInView duration={400}>
            <GreetingHeader />
          </FadeInView>

          {/* Overtime Alert */}
          <SlideUpView duration={400} delay={100}>
            <OvertimeAlert />
          </SlideUpView>

          {/* Today's Shift */}
          <SlideUpView duration={400} delay={150}>
            <TodaysShiftCard />
          </SlideUpView>

          {/* Quick Actions */}
          <SlideUpView duration={400} delay={200}>
            <QuickActions
              onClockIn={handleClockIn}
              onRequestSwap={handleRequestSwap}
            />
          </SlideUpView>

          {/* Quick Stats */}
          <SlideUpView duration={400} delay={250}>
            <ShiftSummaryCard />
          </SlideUpView>

          {/* Upcoming Shifts */}
          <SlideUpView duration={400} delay={300}>
            <UpcomingShifts />
          </SlideUpView>

          {/* Notification Demo */}
          <SlideUpView duration={400} delay={350}>
            <NotificationDemo />
          </SlideUpView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
