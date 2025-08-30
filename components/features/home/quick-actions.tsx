import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/card';
import { Clock, RefreshCw } from 'lucide-react-native';

interface QuickActionsProps {
  className?: string;
  onClockIn?: () => void;
  onRequestSwap?: () => void;
  isClockingIn?: boolean;
  isRequestingSwap?: boolean;
}

export function QuickActions({
  className = '',
  onClockIn,
  onRequestSwap,
  isClockingIn,
  isRequestingSwap,
}: QuickActionsProps) {
  return (
    <Card className={`p-4 bg-white ${className}`}>
      <Text className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</Text>

      <View className="flex-row gap-3">
                <TouchableOpacity
          className={`flex-1 bg-green-600 py-3 px-4 rounded-lg flex-row items-center justify-center gap-2 ${
            isClockingIn && 'opacity-50'
          }`}
          onPress={onClockIn}
          disabled={isClockingIn}
        >
          <Clock size={18} className="text-white" />
          <Text className="text-white font-medium">Clock In</Text>
        </TouchableOpacity>

                <TouchableOpacity
          className={`flex-1 bg-amber-600 py-3 px-4 rounded-lg flex-row items-center justify-center gap-2 ${
            isRequestingSwap && 'opacity-50'
          }`}
          onPress={onRequestSwap}
          disabled={isRequestingSwap}
        >
          <RefreshCw size={18} className="text-white" />
          <Text className="text-white font-medium">Request Swap</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

