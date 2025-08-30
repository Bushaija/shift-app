import React from 'react';
import { View, TouchableOpacity } from 'react-native';

interface PaginationDotsProps {
  total: number;
  current: number;
  onDotPress: (index: number) => void;
}

export function PaginationDots({ total, current, onDotPress }: PaginationDotsProps) {
  return (
    <View className="flex-row justify-center space-x-2 flex gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onDotPress(index)}
          className={`w-3 h-3 rounded-full ${index === current
              ? 'bg-blue-600'
              : 'bg-gray-300'
            }`}
        />
      ))}
    </View>
  );
}
