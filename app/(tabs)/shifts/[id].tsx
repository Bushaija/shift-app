import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useShiftsStore } from '@/stores/shifts-store';
import { useAuthStore } from '@/stores/auth-store';
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  User,
  Building,
  AlertTriangle,
  CheckCircle,
  Calendar
} from 'lucide-react-native';

export default function JobDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { availableShifts, applyForShift, isLoading } = useShiftsStore();
  const { user } = useAuthStore();
  const [shift, setShift] = useState<any>(null);

  useEffect(() => {
    if (id && availableShifts.length > 0) {
      const foundShift = availableShifts.find(s => s.id === id);
      setShift(foundShift);
    }
  }, [id, availableShifts]);

  const handleApply = async () => {
    if (!shift) return;

    Alert.alert(
      'Apply for Shift',
      `Are you sure you want to apply for ${shift.title} at ${shift.facilityName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Apply',
          onPress: async () => {
            try {
              await applyForShift(shift.id);
              Alert.alert(
                'Application Submitted',
                'Your application has been submitted successfully. You will be notified when the facility responds.',
                [
                  { text: 'OK', onPress: () => router.back() }
                ]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to apply for shift. Please try again.');
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (startTime: string, endTime: string) => {
    return `${startTime} - ${endTime}`;
  };

  if (!shift) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center p-8">
          <Text className="text-lg text-gray-600">Loading shift details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-4 py-4 border-b border-gray-200">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color="#374151" />
            </TouchableOpacity>
            <View className="text-center w-full">
              <Text className="text-center text-lg font-semibold text-gray-900">Shift Details</Text>
              <Text className="text-center text-sm text-gray-600">{shift.facilityName}</Text>
            </View>
          </View>
        </View>

        <View className="p-4 space-y-4 flex flex-col gap-2">
          {/* Job Title and Status */}
          <Card className="p-6 bg-white rounded-xl">
            <View className="flex-row justify-between items-start mb-4">
              <View className="flex-1">
                <Text className="text-xl font-bold text-gray-900">{shift.title}</Text>
                <Text className="text-gray-600 mt-1">{shift.department}</Text>
              </View>
              {shift.isUrgent && (
                <View className="bg-red-100 px-3 py-1 rounded-full">
                  <Text className="text-red-600 text-sm font-medium">URGENT</Text>
                </View>
              )}
            </View>

            <View className="flex-row items-center mb-4">
              <Building size={20} color="#6B7280" />
              <Text className="ml-2 text-gray-700 font-medium">{shift.facilityName}</Text>
            </View>

            <View className="flex-row items-center">
              <View className="bg-blue-100 px-3 py-1 rounded-full">
                <Text className="text-blue-600 text-sm font-medium">{shift.licenseType}</Text>
              </View>
            </View>
          </Card>

          {/* Pay and Hours */}
          <Card className="p-6 bg-white rounded-xl">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Compensation</Text>
            <View className="space-y-3">
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  {/* <DollarSign size={20} color="#10B981" /> */}
                  <Text className="ml-2 text-gray-700">Hourly Rate</Text>
                </View>
                <Text className="text-2xl font-bold text-green-600">RWF {shift.hourlyRate}/hr</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Clock size={20} color="#6B7280" />
                  <Text className="ml-2 text-gray-700">Total Hours</Text>
                </View>
                <Text className="text-lg font-semibold text-gray-900">{shift.totalHours} hours</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-700">Total Pay</Text>
                <Text className="text-xl font-bold text-blue-600">
                  RWF {(shift.hourlyRate * shift.totalHours).toLocaleString()}
                </Text>
              </View>
            </View>
          </Card>

          {/* Schedule */}
          <Card className="p-6 bg-white rounded-xl">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Schedule</Text>
            <View className="space-y-3">
              <View className="flex-row items-center">
                <Calendar size={20} color="#6B7280" />
                <Text className="ml-2 text-gray-700">{formatDate(shift.shiftDate)}</Text>
              </View>
              <View className="flex-row items-center">
                <Clock size={20} color="#6B7280" />
                <Text className="ml-2 text-gray-700">{formatTime(shift.startTime, shift.endTime)}</Text>
              </View>
            </View>
          </Card>

          {/* Location */}
          {shift.location && (
            <Card className="p-6 bg-white rounded-xl">
              <Text className="text-lg font-semibold text-gray-900 mb-4">Location</Text>
              <View className="flex-row items-start">
                <MapPin size={20} color="#6B7280" className="mt-0.5" />
                <View className="ml-2 flex-1">
                  <Text className="text-gray-700">{shift.location}</Text>
                  {shift.distance && (
                    <Text className="text-gray-500 text-sm mt-1">
                      {shift.distance} miles away
                    </Text>
                  )}
                </View>
              </View>
            </Card>
          )}

          {/* Job Description */}
          {shift.description && (
            <Card className="p-6 bg-white rounded-xl">
              <Text className="text-lg font-semibold text-gray-900 mb-4">Job Description</Text>
              <Text className="text-gray-700 leading-6">{shift.description}</Text>
            </Card>
          )}

          {/* Requirements */}
          <Card className="p-6 bg-white rounded-xl">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Requirements</Text>
            <View className="space-y-2">
              <View className="flex-row items-center">
                <CheckCircle size={16} color="#10B981" />
                <Text className="ml-2 text-gray-700">Valid {shift.licenseType} license</Text>
              </View>
              <View className="flex-row items-center">
                <CheckCircle size={16} color="#10B981" />
                <Text className="ml-2 text-gray-700">Minimum 1 year experience</Text>
              </View>
              <View className="flex-row items-center">
                <CheckCircle size={16} color="#10B981" />
                <Text className="ml-2 text-gray-700">BLS certification</Text>
              </View>
              {shift.department === 'Emergency' && (
                <View className="flex-row items-center">
                  <CheckCircle size={16} color="#10B981" />
                  <Text className="ml-2 text-gray-700">ACLS certification</Text>
                </View>
              )}
            </View>
          </Card>

          {/* Important Notes */}
          {shift.isUrgent && (
            <Card className="p-6 bg-red-50 rounded-xl border border-red-200">
              <View className="flex-row items-start">
                <AlertTriangle size={20} color="#DC2626" className="mt-0.5" />
                <View className="ml-2 flex-1">
                  <Text className="text-red-800 font-medium mb-1">Urgent Need</Text>
                  <Text className="text-red-700 text-sm">
                    This shift needs to be filled immediately. Please apply only if you can commit to this schedule.
                  </Text>
                </View>
              </View>
            </Card>
          )}
        </View>
      </ScrollView>

      {/* Apply Button */}
      <View className="p-4 bg-white border-t border-gray-200">
        <Button
          onPress={handleApply}
          className="bg-blue-600 py-4 rounded-xl"
          disabled={isLoading}
        >
          <Text className="text-white text-lg font-semibold text-center">
            {isLoading ? 'Applying...' : 'Apply for Shift'}
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
