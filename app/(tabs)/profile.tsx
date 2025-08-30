import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormField, FormInput, FormTextarea } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import {
  User,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Edit,
  Wallet,
  Calendar,
  Star,
  Clock
} from 'lucide-react-native';
import { useAuthStore } from '@/stores/auth-store';
import { useShiftsStore } from '@/stores/shifts-store';
import { router } from 'expo-router';
import { useCreateFatigueAssessment } from '@/hooks/api/profile/use-create-fatigue-assessment';
import { ApiError } from '@/types/api';
import { setAuthToken } from '@/services/api';
import { queryClient } from '@/lib/query-client';

export default function ProfileScreen() {
  const { nurse, logout } = useAuthStore();
  const { userBookings } = useShiftsStore();

  const [openFatigueDialog, setOpenFatigueDialog] = React.useState(false);

  type FatigueFormValues = {
    sleep_hours_reported: string;
    stress_level_reported: string;
    caffeine_intake_level: string;
    notes: string;
  };

  const form = useForm<FatigueFormValues>({
    defaultValues: {
      sleep_hours_reported: '',
      stress_level_reported: '',
      caffeine_intake_level: '0',
      notes: '',
    },
  });

  const nurseId = nurse?.worker_id;
  const createAssessment = useCreateFatigueAssessment(nurseId ?? 0, {
    onSuccess: () => {
      setOpenFatigueDialog(false);
      form.reset();
      Alert.alert('Success', 'Fatigue assessment submitted successfully.');
    },
    onError: (e: ApiError) => {
      Alert.alert('Error', e.message || 'Failed to submit assessment');
    },
  } as any);

  const submitFatigueAssessment = form.handleSubmit((values) => {
    if (!nurseId) {
      Alert.alert('Unavailable', 'Nurse profile not found.');
      return;
    }
    const payload = {
      sleep_hours_reported: Number(values.sleep_hours_reported),
      stress_level_reported: Number(values.stress_level_reported),
      caffeine_intake_level: Number(values.caffeine_intake_level || 0),
      notes: values.notes || '',
    };
    createAssessment.mutate(payload as any);
  });

  const menuItems = [
    // {
    //   id: 'profile',
    //   title: 'Edit Profile',
    //   icon: Edit,
    //   color: '#007AFF',
    //   onPress: () => router.push('/(tabs)/profile/edit'),
    // },
    // {
    //   id: 'wallet',
    //   title: 'Wallet & Payments',
    //   icon: Wallet,
    //   color: '#10B981',
    //   onPress: () => router.push('/wallet'),
    // },
    // {
    //   id: 'schedule',
    //   title: 'Schedule Preferences',
    //   icon: Calendar,
    //   color: '#F59E0B',
    //   onPress: () => router.push('/(tabs)/schedule'),
    // },
    {
      id: 'availability',
      title: 'Set Availability',
      icon: Clock,
      color: '#059669',
      onPress: () => router.push('/profile/availability'),
    },
    {
      id: 'fatigue',
      title: 'Take Fatigue Assessment',
      icon: Shield,
      color: '#EF4444',
      onPress: () => {
        if (!nurseId) {
          Alert.alert('Unavailable', 'Nurse profile not found.');
          return;
        }
        setOpenFatigueDialog(true);
      },
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      color: '#8B5CF6',
      onPress: () => router.push('/(tabs)/profile/notifications'),
    },
    // {
    //   id: 'settings',
    //   title: 'Settings',
    //   icon: Settings,
    //   color: '#6B7280',
    //   onPress: () => router.push('/profile/settings'),
    // },
    // {
    //   id: 'security',
    //   title: 'Security & Privacy',
    //   icon: Shield,
    //   color: '#EF4444',
    //   onPress: () => router.push('/profile/settings'),
    // },
    // {
    //   id: 'help',
    //   title: 'Help & Support',
    //   icon: HelpCircle,
    //   color: '#06B6D4',
    //   onPress: () => router.push('/profile/settings'),
    // },
  ];

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            const doLogout = async () => {
              console.log('[Logout] begin');
              setAuthToken(null);
              await queryClient.clear();
              logout();
              try {
                console.log('[Logout] navigate replace /auth/signin');
                router.replace('/auth/signin');
                // Fallback for web if navigation stack resists replacement
                if (Platform.OS === 'web') {
                  setTimeout(() => {
                    console.log('[Logout] fallback navigate push /auth/signin');
                    try { router.push('/auth/signin'); } catch { }
                    // Last resort hard redirect
                    setTimeout(() => {
                      if (typeof window !== 'undefined') {
                        console.log('[Logout] hard redirect to /auth/signin');
                        window.location.assign('/auth/signin');
                      }
                    }, 150);
                  }, 50);
                }
              } catch (e) {
                console.log('[Logout] navigation error, hard redirect', e);
                if (Platform.OS === 'web' && typeof window !== 'undefined') {
                  window.location.assign('/auth/signin');
                }
              }
            };
            void doLogout();
          }
        }
      ]
    );
  };

  // Calculate statistics
  const completedShifts = userBookings.filter(booking => booking.status === 'completed').length;
  const totalEarnings = userBookings
    .filter(booking => booking.status === 'completed')
    .reduce((total, booking) => {
      const shift = booking.shift;
      if (shift) {
        return total + (shift.hourlyRate * shift.totalHours);
      }
      return total;
    }, 0);

  // Display helpers
  const displayName = nurse ? nurse.user.name : 'User';
  const displayTitle = nurse ? `${nurse.specialization} Nurse` : 'Healthcare Professional';
  const employeeId = nurse?.employee_id;
  const licenseNumber = nurse?.license_number;
  const hourlyRate = nurse ? nurse.base_hourly_rate : undefined;
  const seniorityPoints = nurse?.seniority_points;
  const fatigueScore = nurse?.fatigue_score;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="flex flex-col gap-4 p-4">
          <FatigueAssessmentDialog
            open={openFatigueDialog}
            onOpenChange={setOpenFatigueDialog}
            form={form}
            onSubmit={submitFatigueAssessment}
            submitting={createAssessment.isPending}
          />
          {/* Profile Header */}
          <Card className="p-4 bg-white rounded-xl border-none">
            <View className="items-center">
              <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-4">
                <User size={32} color="#007AFF" />
              </View>
              <Text className="text-xl font-bold text-gray-900">{displayName}</Text>
              <Text className="text-gray-600">{displayTitle}</Text>
              {employeeId && (
                <Text className="text-gray-500 text-sm mt-1">ID: {employeeId}</Text>
              )}
              {licenseNumber && (
                <Text className="text-gray-500 text-sm">License: {licenseNumber}</Text>
              )}
              <View className="flex-row items-center mt-2">
                <Star size={16} color="#F59E0B" fill="#F59E0B" />
                <Text className="text-gray-600 ml-1">4.8 (127 reviews)</Text>
              </View>
            </View>
          </Card>

          {/* Stats */}
          <View className="flex-row gap-4 space-x-4">
            <Card className="flex-1 p-4 bg-white rounded-xl">
              <Text className="text-2xl font-bold text-blue-600">{completedShifts}</Text>
              <Text className="text-sm text-gray-600">Shifts completed</Text>
            </Card>
            <Card className="flex-1 p-4 bg-white rounded-xl">
              <Text className="text-2xl font-bold text-green-600">
                {hourlyRate ? `RWF ${hourlyRate}/hr` : 'RWF 0/hr'}
              </Text>
              <Text className="text-sm text-gray-600">Hourly rate</Text>
            </Card>
          </View>

          {/* Nurse-specific stats if available */}
          {nurse && (
            <View className="flex-row gap-4 space-x-4">
              <Card className="flex-1 p-4 bg-white rounded-xl">
                <Text className="text-2xl font-bold text-purple-600">{seniorityPoints || 0}</Text>
                <Text className="text-sm text-gray-600">Seniority points</Text>
              </Card>
              <Card className="flex-1 p-4 bg-white rounded-xl">
                <Text className="text-2xl font-bold text-orange-600">{fatigueScore || 0}/10</Text>
                <Text className="text-sm text-gray-600">Fatigue score</Text>
              </Card>
            </View>
          )}

          {/* Menu Items */}
          <Card className="bg-white rounded-xl">
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                className={`flex-row items-center p-4 ${index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                onPress={item.onPress}
              >
                <View
                  className="w-10 h-10 rounded-lg items-center justify-center mr-4"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <item.icon size={20} color={item.color} />
                </View>
                <Text className="flex-1 text-gray-900 font-medium">
                  {item.title}
                </Text>
                <Text className="text-gray-400">›</Text>
              </TouchableOpacity>
            ))}
          </Card>

          {/* Logout Button */}
          <TouchableOpacity
            className="mt-6 bg-red-50 p-4 rounded-xl border border-red-200"
            onPress={handleSignOut}
          >
            <View className="flex-row items-center justify-center">
              <LogOut size={20} color="#EF4444" />
              <Text className="text-red-600 font-medium ml-2">Sign Out</Text>
            </View>
          </TouchableOpacity>

          {/* App Version */}
          <View className="items-center mt-8">
            <Text className="text-gray-400 text-sm">
              Healthcare Staffing v1.0.0
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Dialog for fatigue assessment
function FatigueAssessmentDialog({
  open,
  onOpenChange,
  form,
  onSubmit,
  submitting,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: ReturnType<typeof useForm<any>>;
  onSubmit: () => void;
  submitting: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Fatigue Assessment</DialogTitle>
          <DialogDescription>
            Provide your current state to help assess fatigue risk.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <View className="gap-4">
            <FormField
              control={form.control}
              name="sleep_hours_reported"
              rules={{ required: 'Required', pattern: { value: /^\d+(?:\.\d+)?$/, message: 'Enter a number' } }}
              render={({ field }) => (
                <FormInput
                  label="Sleep hours (last night)"
                  keyboardType="numeric"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  placeholder="e.g., 6.5"
                />
              )}
            />
            <FormField
              control={form.control}
              name="stress_level_reported"
              rules={{ required: 'Required', pattern: { value: /^(?:[1-9]|10)$/, message: '1-10' } }}
              render={({ field }) => (
                <FormInput
                  label="Stress level (1-10)"
                  keyboardType="numeric"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  placeholder="1-10"
                />
              )}
            />
            <FormField
              control={form.control}
              name="caffeine_intake_level"
              rules={{ pattern: { value: /^\d+$/, message: 'Enter a whole number' } }}
              render={({ field }) => (
                <FormInput
                  label="Caffeine intake (cups today)"
                  keyboardType="numeric"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  placeholder="0"
                />
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormTextarea
                  label="Notes (optional)"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  placeholder="Anything else you want to add"
                  numberOfLines={4}
                />
              )}
            />
          </View>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button disabled={submitting} onPress={onSubmit}>
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
