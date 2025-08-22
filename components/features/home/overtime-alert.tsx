import React from 'react';
import { View, Text } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';

interface OvertimeAlertProps {
  className?: string;
  show?: boolean;
  currentHours?: number;
  maxHours?: number;
}

export function OvertimeAlert({
  className = '',
  show = true,
  currentHours = 38.5,
  maxHours = 40
}: OvertimeAlertProps) {
  const isOvertime = currentHours >= maxHours;

  if (!show || !isOvertime) return null;

  return (
    <View className={`flex-row items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg ${className}`}>
      <AlertTriangle size={20} className="text-amber-600" />
      <View className="flex-1">
        <Text className="text-amber-800 font-medium">
          Overtime Alert: {currentHours}/{maxHours} hours this week
        </Text>
        <Text className="text-amber-700 text-sm">
          You're approaching your weekly limit
        </Text>
      </View>
    </View>
  );
}
