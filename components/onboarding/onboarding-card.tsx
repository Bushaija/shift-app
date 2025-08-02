import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '@/components/ui/card';

interface OnboardingCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
}

export function OnboardingCard({ title, subtitle, description, icon }: OnboardingCardProps) {
  return (
    <Card className="w-full max-w-sm p-8 bg-white rounded-3xl shadow-lg">
      <View className="items-center space-y-6">
        <Text className="text-6xl">{icon}</Text>

        <View className="items-center space-y-2">
          <Text className="text-2xl font-bold text-gray-900 text-center">
            {title}
          </Text>
          <Text className="text-lg font-semibold text-blue-600 text-center">
            {subtitle}
          </Text>
        </View>

        <Text className="text-base text-gray-600 text-center leading-6">
          {description}
        </Text>
      </View>
    </Card>
  );
}
