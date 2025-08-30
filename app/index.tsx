// index.tsx
import { Redirect } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { getItem } from '@/lib/storage';
import { useAuthStore } from '@/stores/auth-store';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<string | null>(null);
  const { isAuthenticated, requiresPasswordChange, checkAuth } = useAuthStore();
  console.log('[Index] render', { isLoading, isAuthenticated, requiresPasswordChange, hasCompletedOnboarding });

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check onboarding status
        const onboardingStatus = await getItem<string>('hasCompletedOnboarding');
        setHasCompletedOnboarding(onboardingStatus);
        console.log('[Index] onboardingStatus', onboardingStatus);

        // Check authentication status
        await checkAuth();
        console.log('[Index] after checkAuth', { isAuthenticatedAfter: useAuthStore.getState().isAuthenticated, requiresPasswordChangeAfter: useAuthStore.getState().requiresPasswordChange });

        setIsLoading(false);
      } catch (error) {
        console.error('App initialization error:', error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [checkAuth]);

  // Show loading spinner while initializing
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600 text-lg">Loading...</Text>
      </View>
    );
  }

  // Authentication flow logic
  if (isAuthenticated) {
    console.log('[Index] isAuthenticated true, requiresPasswordChange:', requiresPasswordChange);
    if (requiresPasswordChange) {
      // User is authenticated but needs to change password
      console.log('[Index] redirect -> /force-password-change');
      return <Redirect href="/force-password-change" />;
    }
    // User is fully authenticated, go to main app
    console.log('[Index] redirect -> /(tabs)');
    return <Redirect href="/(tabs)" />;
  }

  // User is not authenticated
  if (hasCompletedOnboarding === 'true') {
    // User has completed onboarding, show login
    console.log('[Index] unauthenticated, onboarding complete -> /auth/signin');
    return <Redirect href="/auth/signin" />;
  }

  // User hasn't completed onboarding, show onboarding
  console.log('[Index] unauthenticated, onboarding not complete -> /onboarding');
  return <Redirect href="/onboarding" />;
}
