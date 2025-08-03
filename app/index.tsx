import { Redirect } from 'expo-router';
import { View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { getItem } from '@/lib/storage';
import { useAuthStore } from '@/stores/auth-store';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<string | null>(null);
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const onboardingStatus = await getItem<string>('hasCompletedOnboarding');
        setHasCompletedOnboarding(onboardingStatus);
        await checkAuth();
        setIsLoading(false);
      } catch (error) {
        console.error('App initialization error:', error);
        setIsLoading(false);
      }
    };
    initializeApp();
  }, [checkAuth]);

  if (isLoading) return null;
  if (isAuthenticated) return <Redirect href="/(tabs)" />;
  if (hasCompletedOnboarding === 'true') return <Redirect href="/auth/signin" />;
  return <Redirect href="/onboarding" />;
}
