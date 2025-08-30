import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShiftFilters } from '@/components/features/shifts/shift-filters';
import { ShiftList } from '@/components/features/shifts/shift-list';
import { useShiftsStore } from '@/stores/shifts-store';
import { Briefcase, Calendar, Clock, MapPin, DollarSign } from 'lucide-react-native';
import { Card } from '@/components/ui/card';
import { router } from 'expo-router';

export default function ShiftsScreen() {
  const { fetchAvailableShifts, fetchUserBookings, userBookings, filteredShifts, isLoading, cancelBooking } = useShiftsStore();
  const [activeTab, setActiveTab] = useState<'available' | 'bookings'>('available');

  useEffect(() => {
    // Load shifts when component mounts
    fetchAvailableShifts();
    fetchUserBookings();
  }, [fetchAvailableShifts, fetchUserBookings]);

  const handleDetails = (booking: any) => {
    if (booking.shift?.id) {
      router.push(`/(tabs)/shifts/${booking.shift.id}`);
    }
  };

  const handleCancel = (booking: any) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            await cancelBooking(booking.id);
            fetchUserBookings();
          },
        },
      ]
    );
  };

  const renderBookingCard = (booking: any) => (
    <Card key={booking.id} className="p-4 bg-white rounded-xl mb-4">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900">
            {booking.shift?.title || 'Shift'}
          </Text>
          <Text className="text-gray-500">{booking.shift?.facilityName}</Text>
        </View>
        <View className={`px-2 py-1 rounded ${booking.status === 'confirmed' ? 'bg-green-100' :
          booking.status === 'pending' ? 'bg-yellow-100' :
            booking.status === 'completed' ? 'bg-blue-100' :
              'bg-red-100'
          }`}>
          <Text className={`text-xs font-medium ${booking.status === 'confirmed' ? 'text-green-600' :
            booking.status === 'pending' ? 'text-yellow-600' :
              booking.status === 'completed' ? 'text-blue-600' :
                'text-red-600'
            }`}>
            {booking.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View className="space-y-2 mb-3">
        <View className="flex-row items-center">
          <Calendar size={16} color="#6B7280" />
          <Text className="ml-2 text-gray-600">
            {new Date(booking.shift?.shiftDate).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric'
            })}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Clock size={16} color="#6B7280" />
          <Text className="ml-2 text-gray-600">
            {booking.shift?.startTime} - {booking.shift?.endTime}
          </Text>
        </View>

        {booking.shift?.location && (
          <View className="flex-row items-center">
            <MapPin size={16} color="#6B7280" />
            <Text className="ml-2 text-gray-600">{booking.shift.location}</Text>
          </View>
        )}
      </View>

      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <DollarSign size={16} color="#10B981" />
          <Text className="text-lg font-bold text-green-600 ml-1">
            RWF {booking.shift?.hourlyRate}/hr
          </Text>
        </View>

        <View className="flex-row gap-2">
          <TouchableOpacity className="bg-blue-600 px-3 py-2 rounded-lg" onPress={() => handleDetails(booking)}>
            <Text className="text-white text-sm font-medium">Details</Text>
          </TouchableOpacity>
          {booking.status === 'pending' && (
            <TouchableOpacity className="bg-red-600 px-3 py-2 rounded-lg" onPress={() => handleCancel(booking)}>
              <Text className="text-white text-sm font-medium">Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1">
        {/* Header */}
        <View className="p-4 bg-white border-b border-gray-200">
          <View className="flex flex-col py-2">
            <Text className="text-2xl font-bold text-gray-900 text-center">
              Shifts
            </Text>
            <Text className="text-gray-600 text-center mt-1">
              Find opportunities and manage your bookings
            </Text>
          </View>

          {/**
        <View className="flex-row bg-white rounded-lg p-1 mb-6">
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-2 rounded-md ${activeTab === tab.id
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
       */}

          {/* Tab Navigation */}
          <View className="flex-row bg-gray-100 rounded-lg p-1 mt-4">
            <TouchableOpacity
              className={`flex-1 py-3 px-4 rounded-md ${activeTab === 'available' ? 'bg-blue-600 shadow-sm' : ''
                }`}
              onPress={() => setActiveTab('available')}
            >
              <Text className={`text-center font-medium ${activeTab === 'available' ? 'text-white' : 'text-gray-600'
                }`}>
                Available Shifts
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 px-4 rounded-md ${activeTab === 'bookings' ? 'bg-blue-600 shadow-sm' : ''
                }`}
              onPress={() => setActiveTab('bookings')}
            >
              <Text className={`text-center font-medium ${activeTab === 'bookings' ? 'text-white' : 'text-gray-600'
                }`}>
                My Shifts
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View className="flex-1 px-4 py-4">
          {activeTab === 'available' ? (
            <>
              {/* Search and Filter */}
              <ShiftFilters />

              {/* Quick Stats */}
              <View className="flex-row gap-3 my-4">
                <View className="flex-1 bg-white p-3 rounded-lg border border-gray-200">
                  <Text className="text-2xl font-bold text-blue-600">
                    {filteredShifts.length}
                  </Text>
                  <Text className="text-sm text-gray-600">Available</Text>
                </View>
                <View className="flex-1 bg-white p-3 rounded-lg border border-gray-200">
                  <Text className="text-2xl font-bold text-green-600">
                    {filteredShifts.filter(s => s.isUrgent).length}
                  </Text>
                  <Text className="text-sm text-gray-600">Urgent</Text>
                </View>
                <View className="flex-1 bg-white p-3 rounded-lg border border-gray-200">
                  <Text className="text-2xl font-bold text-purple-600">
                    {filteredShifts.filter(s => s.department === 'Emergency').length}
                  </Text>
                  <Text className="text-sm text-gray-600">Emergency</Text>
                </View>
              </View>

              {/* Shifts List */}
              <View className="flex-1">
                <ShiftList />
              </View>
            </>
          ) : (
            <>
              {/* Bookings Header */}
              <View className="mb-4">
                <Text className="text-lg font-semibold text-gray-900 mb-2">
                  My Bookings ({userBookings.length})
                </Text>
                <Text className="text-gray-600">
                  Track your confirmed shifts and pending requests
                </Text>
              </View>

              {/* Bookings List */}
              <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {userBookings.length === 0 ? (
                  <View className="flex-1 justify-center items-center p-8">
                    <Briefcase size={48} color="#9CA3AF" />
                    <Text className="text-lg font-medium text-gray-900 mt-4">
                      No bookings yet
                    </Text>
                    <Text className="text-gray-600 text-center mt-2">
                      Apply for shifts to see them here
                    </Text>
                    <TouchableOpacity
                      className="bg-blue-600 px-4 py-2 rounded-lg mt-4"
                      onPress={() => setActiveTab('available')}
                    >
                      <Text className="text-white font-medium">Browse Shifts</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  userBookings.map(renderBookingCard)
                )}
              </ScrollView>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
