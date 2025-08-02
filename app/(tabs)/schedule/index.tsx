import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, MapPin } from 'lucide-react-native';

export default function ScheduleScreen() {
  const [activeTab, setActiveTab] = useState('upcoming');

  const tabs = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'ongoing', label: 'Ongoing' },
    { id: 'past', label: 'Past' },
  ];

  const upcomingShifts = [
    {
      id: 1,
      title: 'RN - Emergency Department',
      facility: 'City General Hospital',
      date: 'Tomorrow',
      time: '7:00 PM - 3:00 AM',
      status: 'confirmed',
      pay: '$45/hr',
    },
    {
      id: 2,
      title: 'LPN - ICU',
      facility: 'Memorial Medical Center',
      date: 'Friday, Dec 15',
      time: '6:00 AM - 6:00 PM',
      status: 'pending',
      pay: '$38/hr',
    },
  ];

  const ongoingShifts = [
    {
      id: 3,
      title: 'CNA - Medical Surgical',
      facility: 'Regional Healthcare',
      date: 'Today',
      time: '3:00 PM - 11:00 PM',
      status: 'ongoing',
      pay: '$28/hr',
    },
  ];

  const pastShifts = [
    {
      id: 4,
      title: 'RN - Emergency Department',
      facility: 'City General Hospital',
      date: 'Yesterday',
      time: '7:00 PM - 3:00 AM',
      status: 'completed',
      pay: '$45/hr',
    },
  ];

  const getShiftsForTab = () => {
    switch (activeTab) {
      case 'upcoming':
        return upcomingShifts;
      case 'ongoing':
        return ongoingShifts;
      case 'past':
        return pastShifts;
      default:
        return [];
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Header */}
          <View className="flex flex-col justify-center items-center mb-6 py-4">
            <Text className="text-lg font-bold text-gray-900">
              My Schedule
            </Text>
            <Text className="text-gray-600 mt-1">
              Manage your shifts and bookings
            </Text>
          </View>

          {/* Tab Navigation */}
          <View className="flex-row bg-white rounded-lg p-1 mb-6">
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-4 rounded-md ${activeTab === tab.id
                  ? 'bg-blue-600'
                  : 'bg-transparent'
                  }`}
              >
                <Text
                  className={`text-center font-medium ${activeTab === tab.id
                    ? 'text-white'
                    : 'text-gray-600'
                    }`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Shifts List */}
          <View className="space-y-4 flex flex-col gap-4">
            {getShiftsForTab().map((shift) => (
              <Card key={shift.id} className="p-4 bg-white rounded-xl">
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900">
                      {shift.title}
                    </Text>
                    <Text className="text-gray-600">{shift.facility}</Text>
                  </View>
                  <View className={`px-2 py-1 rounded ${getStatusColor(shift.status)}`}>
                    <Text className="text-xs font-medium capitalize">
                      {shift.status}
                    </Text>
                  </View>
                </View>

                <View className="space-y-2 mb-3">
                  <View className="flex-row items-center">
                    <Calendar size={16} color="#6B7280" />
                    <Text className="ml-2 text-gray-600">{shift.date}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Clock size={16} color="#6B7280" />
                    <Text className="ml-2 text-gray-600">{shift.time}</Text>
                  </View>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-lg font-bold text-blue-600">
                    {shift.pay}
                  </Text>
                  {activeTab === 'upcoming' && (
                    <TouchableOpacity className="bg-red-100 px-3 py-1 rounded">
                      <Text className="text-red-600 text-sm font-medium">
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </Card>
            ))}

            {getShiftsForTab().length === 0 && (
              <Card className="p-8 bg-white rounded-xl">
                <View className="items-center">
                  <Calendar size={48} color="#9CA3AF" />
                  <Text className="text-lg font-medium text-gray-900 mt-4">
                    No {activeTab} shifts
                  </Text>
                  <Text className="text-gray-600 text-center mt-2">
                    {activeTab === 'upcoming' && "You don't have any upcoming shifts scheduled."}
                    {activeTab === 'ongoing' && "You don't have any ongoing shifts."}
                    {activeTab === 'past' && "You don't have any past shifts."}
                  </Text>
                </View>
              </Card>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
