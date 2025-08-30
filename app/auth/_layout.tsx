import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { setAuthToken } from '@/services/api';
import { queryClient } from '@/lib/query-client';

export default function AuthLayout() {
  const { logout } = useAuthStore();

  useEffect(() => {
    const resetAuth = async () => {
      console.log('[AuthLayout] resetting auth state when entering auth stack');
      setAuthToken(null);
      await queryClient.clear();
      logout();
    };
    void resetAuth();
  }, [logout]);
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="signin" />
    </Stack>
  );
}
