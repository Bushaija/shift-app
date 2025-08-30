import React from 'react';
import { View, Text } from 'react-native';
import { useAuthStore } from '@/stores/auth-store';

interface GreetingHeaderProps {
  className?: string;
}

export function GreetingHeader({ className = '' }: GreetingHeaderProps) {
  const { user, nurse } = useAuthStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Use nurse data if available, otherwise fall back to legacy user data
  const displayName = nurse?.user.name || user?.firstName || 'there';
  const specialization = nurse?.specialization;
  const greeting = getGreeting();

  return (
    <View className={`flex flex-col gap-2 justify-center items-center py-6 ${className}`}>
      <Text className="text-2xl font-semibold text-gray-900">
        {greeting}, {displayName}
      </Text>
      {specialization && (
        <Text className="text-blue-600 text-lg font-medium">
          {specialization} Nurse
        </Text>
      )}
      <Text className="text-gray-600 text-center">
        Welcome to your shift dashboard
      </Text>
    </View>
  );
}
