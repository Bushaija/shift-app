import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/card';
import { Search, Filter } from 'lucide-react-native';

export default function ShiftsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Header */}
          <View className="flex flex-col py-8">
            <Text className="text-xl text-center font-semibold text-gray-900">
              Available Shifts
            </Text>
            <Text className="text-gray-600 text-center mt-1">
              Find your perfect shift
            </Text>
          </View>

          {/* Search and Filter */}
          <View className="flex-row gap-2 space-x-3 mb-6">
            <TouchableOpacity className="flex-1 flex-row items-center bg-white p-2 rounded-full border border-gray-200">
              <Search size={20} color="#6B7280" />
              <Text className="ml-2 text-gray-500">Search shifts...</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-white p-3 rounded-full border border-gray-200">
              <Filter size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Shifts List */}
          <View className="space-y-4 flex flex-col gap-4">
            <Card className="p-4 bg-white rounded-xl">
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-900">RN - Emergency Department</Text>
                  <Text className="text-gray-500">City General Hospital</Text>
                </View>
                <View className="bg-red-100 px-2 py-1 rounded">
                  <Text className="text-red-600 text-xs font-medium">URGENT</Text>
                </View>
              </View>
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-xl font-bold text-blue-600">$45/hr</Text>
                <Text className="text-gray-600">8 hours</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-gray-600">Today, 7:00 PM - 3:00 AM</Text>
                <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-lg">
                  <Text className="text-white font-medium">Apply</Text>
                </TouchableOpacity>
              </View>
            </Card>

            <Card className="p-4 bg-white rounded-xl">
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900">LPN - ICU</Text>
                  <Text className="text-gray-600">Memorial Medical Center</Text>
                </View>
              </View>
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-2xl font-bold text-green-600">$38/hr</Text>
                <Text className="text-gray-600">12 hours</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-gray-600">Tomorrow, 6:00 AM - 6:00 PM</Text>
                <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-lg">
                  <Text className="text-white font-medium">Apply</Text>
                </TouchableOpacity>
              </View>
            </Card>

            <Card className="p-4 bg-white rounded-xl">
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900">CNA - Medical Surgical</Text>
                  <Text className="text-gray-600">Regional Healthcare</Text>
                </View>
              </View>
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-2xl font-bold text-purple-600">$28/hr</Text>
                <Text className="text-gray-600">8 hours</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-gray-600">Friday, 3:00 PM - 11:00 PM</Text>
                <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-lg">
                  <Text className="text-white font-medium">Apply</Text>
                </TouchableOpacity>
              </View>
            </Card>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
