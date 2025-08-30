import React from 'react';
import { View, Text } from 'react-native';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View className="flex-row items-center space-x-2">
      <View className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
        <View
          className="h-full bg-blue-600 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </View>
      <Text className="text-sm text-gray-600 font-medium">
        {currentStep}/{totalSteps}
      </Text>
    </View>
  );
}
