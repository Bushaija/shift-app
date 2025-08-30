import React from 'react';
import { View, Animated } from 'react-native';
import { useEffect, useRef } from 'react';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  className?: string;
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 4,
  className = ''
}: SkeletonProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: '#E5E7EB',
        opacity,
      }}
      className={className}
    />
  );
}

// Pre-built skeleton components
export function SkeletonCard() {
  return (
    <View className="p-4 bg-white rounded-xl border border-gray-200">
      <Skeleton width="60%" height={20} className="mb-2" />
      <Skeleton width="40%" height={16} className="mb-3" />
      <Skeleton width="100%" height={12} className="mb-1" />
      <Skeleton width="80%" height={12} />
    </View>
  );
}

export function SkeletonListItem() {
  return (
    <View className="flex-row items-center p-4 bg-white border-b border-gray-100">
      <Skeleton width={40} height={40} borderRadius={20} className="mr-3" />
      <View className="flex-1">
        <Skeleton width="70%" height={16} className="mb-1" />
        <Skeleton width="50%" height={12} />
      </View>
      <Skeleton width={60} height={16} />
    </View>
  );
}

export function SkeletonShiftCard() {
  return (
    <View className="p-4 bg-white rounded-xl border border-gray-200 mb-3">
      <View className="flex-row justify-between items-start mb-2">
        <Skeleton width="60%" height={18} />
        <Skeleton width={80} height={16} />
      </View>
      <Skeleton width="40%" height={14} className="mb-2" />
      <View className="flex-row space-x-2">
        <Skeleton width={60} height={24} borderRadius={12} />
        <Skeleton width={80} height={24} borderRadius={12} />
      </View>
    </View>
  );
}
