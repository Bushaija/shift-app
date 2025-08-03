import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingCard } from '@/components/onboarding/onboarding-card';
import { PaginationDots } from '@/components/onboarding/pagination-dots';
import { ProgressIndicator } from '@/components/onboarding/progress-indicator';
import { Button } from '@/components/ui/button';
import { setItem } from '@/lib/storage';

const onboardingData = [
  {
    id: 1,
    title: 'Welcome to NurseConnect',
    subtitle: 'Your healthcare staffing solution',
    description: 'Connect with healthcare facilities and find flexible nursing shifts that match your skills and schedule.',
    icon: '👩‍⚕️',
  },
  {
    id: 2,
    title: 'Browse Available Shifts',
    subtitle: 'Find the perfect nursing opportunities',
    description: 'Browse shifts by location, specialty, shift type, and pay rate. Filter and find exactly what you need.',
    icon: '📋',
  },
  {
    id: 3,
    title: 'Easy Shift Management',
    subtitle: 'Track your schedule and earnings',
    description: 'Manage your shifts, view your schedule, and track your earnings all in one convenient app.',
    icon: '📊',
  },
  {
    id: 4,
    title: 'Secure & Reliable',
    subtitle: 'Your data is protected',
    description: 'Your personal information and shift data are securely stored and protected with industry-standard security.',
    icon: '🔒',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = async () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Mark onboarding as completed
      await setItem('hasCompletedOnboarding', 'true');
      // Navigate to authentication
      router.replace('/auth/signin');
    }
  };

  const handleSkip = async () => {
    // Mark onboarding as completed
    await setItem('hasCompletedOnboarding', 'true');
    router.replace('/auth/signin');
  };

  const handleDotPress = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row justify-between items-center px-5 pt-5">
        <TouchableOpacity onPress={handleSkip} className="p-2">
          <Text className="text-base text-gray-600">Skip</Text>
        </TouchableOpacity>
        <ProgressIndicator
          currentStep={currentIndex + 1}
          totalSteps={onboardingData.length}
        />
      </View>

      <View className="flex-1 justify-center items-center px-5">
        <OnboardingCard
          title={onboardingData[currentIndex].title}
          subtitle={onboardingData[currentIndex].subtitle}
          description={onboardingData[currentIndex].description}
          icon={onboardingData[currentIndex].icon}
        />
      </View>

      <View className="px-5 pb-10 space-y-8">
        <View className="flex-row justify-center items-center">
          <PaginationDots
            total={onboardingData.length}
            current={currentIndex}
            onDotPress={handleDotPress}
          />
        </View>
        <Button
          onPress={handleNext}
          className="bg-blue-600 py-4 rounded-xl items-center mt-8"
        >
          <Text className="text-white text-lg font-semibold">
            {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
