import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/card';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="px-6 py-6">
          {/* Header */}
          <View className="flex flex-col gap-1 justify-center items-center mb-6 py-8">
            <Text className="text-xl font-semibold text-gray-900">
              Welcome back, Robert! 👋
            </Text>
            <Text className="text-gray-600">
              Ready to find your next shift?
            </Text>
          </View>

          {/* Quick Stats */}
          <View className="flex-row gap-2 space-x-4 mb-6">
            <Card className="flex-1 p-4 bg-white rounded-xl">
              <Text className="text-2xl font-bold text-blue-600">12</Text>
              <Text className="text-sm text-gray-600">Shifts this month</Text>
            </Card>
            <Card className="flex-1 p-4 bg-white rounded-xl">
              <Text className="text-2xl font-bold text-green-600">$2,450</Text>
              <Text className="text-sm text-gray-600">Earnings</Text>
            </Card>
          </View>

          {/* Available Shifts */}
          <Card className="p-6 bg-white rounded-xl mb-6 border-none">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Available Shifts
            </Text>
            <View className="flex flex-col gap-2 space-y-3">
              <View className="flex-row justify-between items-center p-3 bg-blue-50 rounded-lg">
                <View>
                  <Text className="font-medium text-gray-900">RN - Emergency</Text>
                  <Text className="text-sm text-gray-600">City General Hospital</Text>
                </View>
                <Text className="font-semibold text-blue-600">$45/hr</Text>
              </View>
              <View className="flex-row justify-between items-center p-3 bg-green-50 rounded-lg">
                <View>
                  <Text className="font-medium text-gray-900">LPN - ICU</Text>
                  <Text className="text-sm text-gray-600">Memorial Medical Center</Text>
                </View>
                <Text className="font-semibold text-green-600">$38/hr</Text>
              </View>
            </View>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6 bg-white rounded-xl">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </Text>
            <View className="flex flex-col gap-4 space-y-3">
              <View className="flex-row gap-2 items-start space-x-3 ">
                <View className="w-2 h-10 bg-green-500 rounded-full" />
                <Text className="flex-1 text-gray-700">
                  Shift confirmed for tomorrow at City General
                </Text>
                <Text className="text-sm text-gray-500">2h ago</Text>
              </View>
              <View className="flex-row gap-2 items-center space-x-3">
                <View className="w-2 h-10 bg-blue-500 rounded-full" />
                <Text className="flex-1 text-gray-700">
                  Payment received for last week's shifts
                </Text>
                <Text className="text-sm text-gray-500">1d ago</Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
