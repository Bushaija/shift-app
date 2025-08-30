import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Calendar, Clock, Save } from 'lucide-react-native';
import { router } from 'expo-router';

export default function AvailabilityScreen() {
  const [availability, setAvailability] = useState({
    monday: 'Available - Any Shift',
    tuesday: 'Available - Any Shift',
    wednesday: 'Available - Any Shift',
    thursday: 'Available - Any Shift',
    friday: 'Available - Any Shift',
    saturday: 'Available - Any Shift',
    sunday: 'Available - Any Shift',
    maxHours: '40',
    specialRequests: ''
  });

  const shiftOptions = [
    'Available - Any Shift',
    'Day Shift Only',
    'Night Shift Only',
    'Not Available'
  ];

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  const handleSave = () => {
    Alert.alert(
      'Success',
      'Your availability has been saved successfully!',
      [{ text: 'OK' }]
    );
  };

  const handleCancel = () => {
    router.back();
  };

  const updateAvailability = (day: string, value: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: value
    }));
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1">
        {/* Header */}
        <View className="p-4 bg-white border-b border-gray-200">
          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="p-2 -ml-2"
            >
              <ArrowLeft size={24} color="#374151" />
            </TouchableOpacity>
            <View className="ml-2">
              <Text className="text-2xl font-bold text-gray-900">
                Set Availability
              </Text>
              <Text className="text-gray-600">
                Manage your weekly schedule preferences
              </Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 p-4">
          {/* Week Selection */}
          <Card className="p-4 mb-4">
            <View className="flex-row items-center mb-3">
              <Calendar size={20} color="#059669" />
              <Text className="text-lg font-semibold text-gray-900 ml-2">
                Week of March 22, 2024
              </Text>
            </View>
            <Text className="text-gray-600">
              Set your availability for each day of the week
            </Text>
          </Card>

          {/* Daily Availability */}
          <Card className="p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Daily Availability
            </Text>

            {daysOfWeek.map((day, index) => (
              <View key={day.key} className={`mb-4 ${index !== daysOfWeek.length - 1 ? 'pb-4 border-b border-gray-100' : ''}`}>
                <Text className="text-base font-medium text-gray-700 mb-2">
                  {day.label}
                </Text>
                <View className="bg-gray-50 rounded-lg p-3">
                  <Text className="text-sm text-gray-600 mb-2">
                    Current: {availability[day.key as keyof typeof availability]}
                  </Text>
                  <View className="flex-row gap-2">
                    {shiftOptions.map((option) => (
                      <TouchableOpacity
                        key={option}
                        className={`px-3 py-2 rounded-md border ${availability[day.key as keyof typeof availability] === option
                            ? 'bg-green-100 border-green-500'
                            : 'bg-white border-gray-300'
                          }`}
                        onPress={() => updateAvailability(day.key, option)}
                      >
                        <Text
                          className={`text-sm ${availability[day.key as keyof typeof availability] === option
                              ? 'text-green-700 font-medium'
                              : 'text-gray-600'
                            }`}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            ))}
          </Card>

          {/* Preferences */}
          <Card className="p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Additional Preferences
            </Text>

            {/* Max Hours */}
            <View className="mb-4">
              <Text className="text-base font-medium text-gray-700 mb-2">
                Preferred Max Hours
              </Text>
              <View className="flex-row items-center bg-gray-50 rounded-lg p-3">
                <Clock size={20} color="#059669" />
                <TextInput
                  className="flex-1 ml-3 text-gray-900"
                  value={availability.maxHours}
                  onChangeText={(text) => setAvailability(prev => ({ ...prev, maxHours: text }))}
                  placeholder="40"
                  keyboardType="numeric"
                  maxLength={2}
                />
                <Text className="text-gray-500">hours/week</Text>
              </View>
              <Text className="text-sm text-gray-500 mt-1">
                Maximum: 60 hours per week
              </Text>
            </View>

            {/* Special Requests */}
            <View className="mb-4">
              <Text className="text-base font-medium text-gray-700 mb-2">
                Special Requests
              </Text>
              <TextInput
                className="bg-gray-50 rounded-lg p-3 text-gray-900 min-h-[80]"
                value={availability.specialRequests}
                onChangeText={(text) => setAvailability(prev => ({ ...prev, specialRequests: text }))}
                placeholder="e.g., Prefer weekends off this week, Need early morning shifts only"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </Card>

          {/* Action Buttons */}
          <View className="flex-row gap-3 mb-6">
            <TouchableOpacity
              className="flex-1 bg-green-600 px-4 py-3 rounded-xl shadow-lg shadow-green-200 flex-row items-center justify-center"
              onPress={handleSave}
            >
              <Save size={18} color="#FFFFFF" />
              <Text className="text-white font-semibold text-base ml-2">
                Save Availability
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 flex-row items-center justify-center"
              onPress={handleCancel}
            >
              <Text className="text-gray-600 font-medium">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

