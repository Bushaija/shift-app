import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/card';
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
  Star
} from 'lucide-react-native';
import { useAuthStore } from '@/stores/auth-store';
import { useShiftsStore } from '@/stores/shifts-store';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore();
  const { userBookings } = useShiftsStore();

  const menuItems = [
    {
      id: 'profile',
      title: 'Edit Profile',
      icon: Edit,
      color: '#007AFF',
      onPress: () => router.push('/(tabs)/profile/edit'),
    },
    {
      id: 'wallet',
      title: 'Wallet & Payments',
      icon: Wallet,
      color: '#10B981',
      onPress: () => router.push('/wallet'),
    },
    {
      id: 'schedule',
      title: 'Schedule Preferences',
      icon: Calendar,
      color: '#F59E0B',
      onPress: () => router.push('/(tabs)/schedule'),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      color: '#8B5CF6',
      onPress: () => router.push('/profile/settings'),
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: Settings,
      color: '#6B7280',
      onPress: () => router.push('/profile/settings'),
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: Shield,
      color: '#EF4444',
      onPress: () => router.push('/profile/settings'),
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: HelpCircle,
      color: '#06B6D4',
      onPress: () => router.push('/profile/settings'),
    },
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
            signOut();
            router.replace('/auth/signin');
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

  const fullName = user ? `${user.firstName} ${user.lastName}` : 'User';
  const licenseType = user?.licenseType || 'Healthcare Professional';

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="flex flex-col gap-4 p-4">
          {/* Profile Header */}
          <Card className="p-4 bg-white rounded-xl border-none">
            <View className="items-center">
              <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-4">
                <User size={32} color="#007AFF" />
              </View>
              <Text className="text-xl font-bold text-gray-900">{fullName}</Text>
              <Text className="text-gray-600">{licenseType}</Text>
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
                RWF {totalEarnings.toLocaleString()}
              </Text>
              <Text className="text-sm text-gray-600">Total earnings</Text>
            </Card>
          </View>

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
