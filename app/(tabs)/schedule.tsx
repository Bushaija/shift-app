import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, MapPin, X } from 'lucide-react-native';
import { useShiftsStore } from '@/stores/shifts-store';

export default function ScheduleScreen() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const { userBookings, fetchUserBookings, cancelBooking, isLoading } = useShiftsStore();

  useEffect(() => {
    fetchUserBookings();
  }, [fetchUserBookings]);

  const tabs = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'ongoing', label: 'Ongoing' },
    { id: 'past', label: 'Past' },
  ];

  const getShiftsForTab = () => {
    const now = new Date();

    return userBookings.filter(booking => {
      const shiftDate = new Date(booking.shift?.shiftDate || '');
      const shiftEndTime = new Date(shiftDate);
      const [hours, minutes] = (booking.shift?.endTime || '00:00').split(':');
      shiftEndTime.setHours(parseInt(hours), parseInt(minutes), 0);

      switch (activeTab) {
        case 'upcoming':
          return (booking.status === 'confirmed' || booking.status === 'pending') &&
            shiftDate > now;
        case 'ongoing':
          return booking.status === 'confirmed' &&
            shiftDate <= now &&
            shiftEndTime >= now;
        case 'past':
          return booking.status === 'completed' ||
            (booking.status === 'confirmed' && shiftEndTime < now);
        default:
          return false;
      }
    });
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
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const formatTime = (startTime: string, endTime: string) => {
    return `${startTime} - ${endTime}`;
  };

  const handleCancelBooking = (bookingId: string, shiftTitle: string) => {
    Alert.alert(
      'Cancel Booking',
      `Are you sure you want to cancel your booking for ${shiftTitle}?`,
      [
        { text: 'Keep Booking', style: 'cancel' },
        {
          text: 'Cancel Booking',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelBooking(bookingId);
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel booking. Please try again.');
            }
          }
        }
      ]
    );
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
            {getShiftsForTab().map((booking) => (
              <Card key={booking.id} className="p-4 bg-white rounded-xl">
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900">
                      {booking.shift?.title}
                    </Text>
                    <Text className="text-gray-600">{booking.shift?.facilityName}</Text>
                  </View>
                  <View className={`px-2 py-1 rounded ${getStatusColor(booking.status)}`}>
                    <Text className="text-xs font-medium capitalize">
                      {booking.status}
                    </Text>
                  </View>
                </View>

                <View className="space-y-2 mb-3">
                  <View className="flex-row items-center">
                    <Calendar size={16} color="#6B7280" />
                    <Text className="ml-2 text-gray-600">
                      {formatDate(booking.shift?.shiftDate || '')}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Clock size={16} color="#6B7280" />
                    <Text className="ml-2 text-gray-600">
                      {formatTime(booking.shift?.startTime || '', booking.shift?.endTime || '')}
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
                  <Text className="text-lg font-bold text-blue-600">
                    ${booking.shift?.hourlyRate}/hr
                  </Text>
                  {activeTab === 'upcoming' && booking.status !== 'cancelled' && (
                    <TouchableOpacity
                      className="bg-red-100 px-3 py-1 rounded flex-row items-center"
                      onPress={() => handleCancelBooking(booking.id, booking.shift?.title || '')}
                      disabled={isLoading}
                    >
                      <X size={14} color="#DC2626" />
                      <Text className="text-red-600 text-sm font-medium ml-1">
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
