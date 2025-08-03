import React from 'react';
import { View, Text } from 'react-native';
import { useAuthStore } from '@/stores/auth-store';

interface GreetingHeaderProps {
  className?: string;
}

export function GreetingHeader({ className = '' }: GreetingHeaderProps) {
  const { user } = useAuthStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = user?.firstName || 'there';
  const greeting = getGreeting();

  return (
    <View className={`flex flex-col gap-1 justify-center items-center py-4 ${className}`}>
      <Text className="text-xl font-semibold text-gray-900">
        {greeting}, {firstName}! 👋
      </Text>
      <Text className="text-gray-600">
        Ready to find your next shift?
      </Text>
    </View>
  );
}
