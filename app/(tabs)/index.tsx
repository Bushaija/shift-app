import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, Alert, TouchableOpacity } from 'react-native';
import { SwapRequestModal } from '@/components/features/home/swap-request-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GreetingHeader } from '@/components/features/home/greeting-header';
import { OvertimeAlert } from '@/components/features/home/overtime-alert';
import { TodaysShiftCard } from '@/components/features/home/todays-shift-card';
import { QuickActions } from '@/components/features/home/quick-actions';
import { UpcomingShifts } from '@/components/features/home/upcoming-shifts';
import { ShiftSummaryCard } from '@/components/features/home/shift-summary-card';
import { NotificationsPanel } from '@/components/features/notifications/notifications-panel';
import { useShiftsStore } from '@/stores/shifts-store';
import { useNotificationDemo } from '@/hooks/useNotificationDemo';
import { SkeletonCard, SkeletonShiftCard } from '@/components/ui/skeleton';
import { ErrorDisplay } from '@/components/ui/error-boundary';
import { FadeInView, SlideUpView } from '@/components/ui/animations';
import { useAuthStore } from '@/stores/auth-store';
import { useClockIn } from '@/hooks/api/attendance/use-clock-in';
import { useCreateSwapRequest } from '@/hooks/api/swaps/use-create-swap-request';
import { CreateSwapRequest } from '@/types/api';
import { Card } from '@/components/ui/card';
import { User, Clock, Award, Shield } from 'lucide-react-native';
import { useDashboard } from '@/hooks/api/dashboard/use-dashboard';
import { useNotificationsCenter } from '@/hooks/api/notifications/use-notifications-center';
import { getCurrentLocation } from '@/services/external/location';

export default function HomeScreen() {
  const [isSwapModalVisible, setSwapModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { fetchAvailableShifts, fetchUserBookings, isLoading: shiftsLoading, error: shiftsError } = useShiftsStore();
  const { nurse, setNurse } = useAuthStore();

  const nurseId = nurse?.worker_id ?? 0;

  const clockInMutation = useClockIn({
        onSuccess: (res) => {
            console.log('[ClockIn] success:', res);
            try { Alert.alert('Success', 'You have successfully clocked in.'); } catch {}
          },
          onError: (error) => {
            console.error('[ClockIn] error:', error);
            try { Alert.alert('Error', error.message || 'Failed to clock in.'); } catch {}
          },
          onSettled: () => {
            console.log('[ClockIn] settled');
          }
  });

  const createSwapRequestMutation = useCreateSwapRequest({
    onSuccess: () => {
      Alert.alert('Success', 'Your swap request has been submitted.');
    },
    onError: (error) => {
      Alert.alert('Error', error.message || 'Failed to create swap request.');
    },
  });
  const { todayShift, todayShifts, upcomingShifts, urgentNotifications, nurseProfile, loading: dashboardLoading, refresh: refreshDashboard } = useDashboard(nurse?.worker_id);
  const { notifications: urgentList, unreadCount, unreadUrgentCount, unreadUrgent, markAllAsRead, markAllUrgentAsRead, isLoading: notificationsLoading } = useNotificationsCenter();

  // Demo notification system
  useNotificationDemo();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await Promise.all([
          fetchAvailableShifts(),
          fetchUserBookings(),
          refreshDashboard()
        ]);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load data'));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchAvailableShifts, fetchUserBookings, nurseId, refreshDashboard]);

  useEffect(() => {
    if (nurseProfile) {
      setNurse(nurseProfile);
    }
  }, [nurseProfile, setNurse]);

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    // Reload data
    Promise.all([
      fetchAvailableShifts(),
      fetchUserBookings(),
      refreshDashboard()
    ]).finally(() => setIsLoading(false));
  };

  // const handleClockIn = () => {
  //   if (!todayShift || !nurseId) {
  //     Alert.alert('Error', 'No shift available to clock in for.');
  //     return;
  //   }

  //   const assignment = todayShift.assignments?.find((assignmentItem: any) => assignmentItem.nurse.worker_id === nurseId);
  //   if (!assignment) {
  //     Alert.alert('Error', 'You are not assigned to the current shift.');
  //     return;
  //   }

  //   clockInMutation.mutate({ assignment_id: assignment.assignment_id });
  // };

  const handleClockIn = async () => {
    console.log('[ClockIn] pressed', { hasTodayShift: !!todayShift, nurseId });
         if (!todayShift || !nurseId) {
         console.warn('[ClockIn] missing shift or nurse');
         try { Alert.alert('Error', 'No shift available to clock in for.'); } catch {}
           return;
         }
     
       const assignment = todayShift.assignments?.find((assignmentItem: any) => assignmentItem.nurse.worker_id === nurseId);
       console.log('[ClockIn] found assignment?', { hasAssignments: !!todayShift.assignments, assignment });
         if (!assignment) {
         console.warn('[ClockIn] no matching assignment for nurse');
         try { Alert.alert('Error', 'You are not assigned to the current shift.'); } catch {}
           return;
         }
     
         const coords = await getCurrentLocation().catch(() => null);
       console.log('[ClockIn] location', coords);
     
         clockInMutation.mutate({
           assignment_id: assignment.assignment_id,
           location_lat: coords?.latitude ?? 0,
           location_lng: coords?.longitude ?? 0,
           notes: '',
         });
       };
  
  const handleRequestSwap = () => {
    if (!todayShift) {
      Alert.alert('No Shift', 'You do not have a shift today to swap.');
      return;
    }
    setSwapModalVisible(true);
  };

  const handleSwapSubmit = (data: Omit<CreateSwapRequest, 'original_shift_id'>) => {
    if (!todayShift) return; // Should not happen, but as a safeguard

    createSwapRequestMutation.mutate(
      {
        original_shift_id: todayShift.shift_id,
        ...data,
      },
      {
        onSuccess: (response) => {
          setSwapModalVisible(false);
          // The existing success alert is in the hook's options, which is fine.
        },
                onError: (error) => {
          // The existing error alert is also in the hook, but we want to log the specific validation details.
          if (error.errors) {
            console.error('Validation Error:', JSON.stringify(error.errors, null, 2));
            const errorMessages = error.errors.map((e) => e.message).join('\n');
            Alert.alert('Validation Error', errorMessages);
          } else {
            console.error('Swap Request Error:', error);
            Alert.alert('Error', error.message || 'An unexpected error occurred while requesting a swap.');
          }
        },
      }
    );
  };

  if (error || shiftsError) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center px-6">
          <ErrorDisplay
            error={
              error ||
              (shiftsError ? new Error(shiftsError) : null)
            }
            onRetry={handleRetry}
            title="Failed to load data"
            message="We couldn't load your dashboard. Please check your connection and try again."
          />
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading || shiftsLoading || dashboardLoading || notificationsLoading) {
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

          {/* Urgent Notifications */}
          {unreadUrgentCount > 0 && (
            <SlideUpView duration={400} delay={60}>
              <Card className="p-4 border border-red-200 bg-red-50">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-red-700 font-semibold">Urgent notifications ({unreadUrgentCount})</Text>
                  {unreadUrgentCount > 0 && (
                    <TouchableOpacity onPress={markAllUrgentAsRead}>
                      <Text className="text-red-600 font-medium">Mark all read</Text>
                    </TouchableOpacity>
                  )}
                </View>
                {(unreadUrgent || []).slice(0, 3).map((n: any) => (
                  <View key={n.id} className="py-2">
                    <Text className="text-gray-900 font-medium">{n.title || n.type || 'Notification'}</Text>
                    {n.message ? (
                      <Text className="text-gray-700 text-sm" numberOfLines={2}>{n.message}</Text>
                    ) : null}
                  </View>
                ))}
              </Card>
            </SlideUpView>
          )}

          {/* Nurse Profile Card */}
          {nurse && (
            <SlideUpView duration={400} delay={50}>
              <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                <View className="flex-row items-center space-x-3">
                  <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center">
                    <User size={24} color="#3B82F6" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900">
                      {nurse.user.name}
                    </Text>
                    <Text className="text-blue-600 font-medium">
                      {nurse.specialization} • {nurse.license_number}
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      Employee ID: {nurse.employee_id}
                    </Text>
                  </View>
                </View>
                
                <View className="flex-row justify-between mt-4 pt-4 border-t border-blue-200">
                  <View className="items-center">
                    <Clock size={20} color="#6B7280" />
                    <Text className="text-xs text-gray-600 mt-1">Max Hours</Text>
                    <Text className="text-sm font-semibold text-gray-900">{nurse.max_hours_per_week}h/week</Text>
                  </View>
                  <View className="items-center">
                    <Award size={20} color="#6B7280" />
                    <Text className="text-xs text-gray-600 mt-1">Seniority</Text>
                    <Text className="text-sm font-semibold text-gray-900">{nurse.seniority_points} pts</Text>
                  </View>
                  <View className="items-center">
                    <Shield size={20} color="#6B7280" />
                    <Text className="text-xs text-gray-600 mt-1">Fatigue</Text>
                    <Text className="text-sm font-semibold text-gray-900">{nurse.fatigue_score}/10</Text>
                  </View>
                </View>
              </Card>
            </SlideUpView>
          )}

          {/* Overtime Alert */}
          <SlideUpView duration={400} delay={100}>
            <OvertimeAlert />
          </SlideUpView>

          {/* Today's Shift */}
          <SlideUpView duration={400} delay={150}>
            <TodaysShiftCard shift={todayShift} />
          </SlideUpView>

          {/* Quick Actions */}
          <SlideUpView duration={400} delay={200}>
            <QuickActions
              onClockIn={handleClockIn}
              onRequestSwap={handleRequestSwap}
              isClockingIn={clockInMutation.isPending}
              isRequestingSwap={createSwapRequestMutation.isPending}
            />
          </SlideUpView>

          {/* Quick Stats */}
          {/* <SlideUpView duration={400} delay={250}>
            <ShiftSummaryCard />
          </SlideUpView> */}

          {/* Upcoming Shifts */}
          <SlideUpView duration={400} delay={300}>
            <UpcomingShifts shifts={upcomingShifts} />
          </SlideUpView>

          {/* Notifications */}
          <NotificationsPanel />
        </View>
      </ScrollView>

      <SwapRequestModal
        isVisible={isSwapModalVisible}
        onClose={() => setSwapModalVisible(false)}
        onSubmit={handleSwapSubmit}
        currentNurseId={nurseId}
      />
    </SafeAreaView>
  );
}
