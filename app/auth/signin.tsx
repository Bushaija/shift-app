// signin.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEmailAuth } from '@/hooks/api/auth/use-email-auth';
import { useAllNurses } from '@/hooks/api/auth/use-nurses';
import { useAuthStore } from '@/stores/auth-store';

export default function NurseLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('auca#123'); // Pre-fill default password

  const { mutate: authenticateNurse, isLoading, isError, error, reset } = useEmailAuth();
  const { data, isLoading: nursesLoading } = useAllNurses();
  const { isAuthenticated, requiresPasswordChange } = useAuthStore();

  console.log('[Signin] render', { isAuthenticated, requiresPasswordChange, nursesLoading, isLoading });
  console.log('[Signin] nurses data:', data);

  // Clear error when component mounts
  useEffect(() => {
    if (reset) reset();
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !requiresPasswordChange) {
      console.log('[Signin] already authenticated -> /(tabs)');
      router.replace('/(tabs)');
    } else if (isAuthenticated && requiresPasswordChange) {
      console.log('[Signin] needs password change -> /force-password-change');
      router.replace('/force-password-change');
    }
  }, [isAuthenticated, requiresPasswordChange]);

  const handleSignIn = async () => {
    if (nursesLoading) {
      Alert.alert('Please wait', 'Loading nurses data...');
      return;
    }
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!password) {
      Alert.alert('Error', 'Please enter a password');
      return;
    }

    authenticateNurse(
      { email: email.trim(), password },
      {
        onSuccess: (response) => {
          if (response.requiresPasswordChange) {
            // First login - redirect to password change
            console.log('[Signin] success requiresPasswordChange -> /force-password-change');
            router.replace('/force-password-change');
          } else {
            // Regular login - go to dashboard
            console.log('[Signin] success -> /(tabs)');
            router.replace('/(tabs)');
          }
        },
        onError: (error) => {
          // Error is already handled by the mutation
          console.log('[Signin] login failed:', error.message);
        },
      }
    );
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    // Clear any previous errors when user starts typing
    if (error && reset) {
      reset();
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    // Clear any previous errors when user starts typing
    if (error && reset) {
      reset();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 justify-center px-6">
        <Card className="p-8 bg-white rounded-2xl shadow-lg">
          <View className="space-y-6">
            {/* Header */}
            <View className="items-center space-y-2 mb-8">
              <Text className="text-2xl font-bold text-gray-900">Welcome Back</Text>
              <Text className="text-gray-600 text-center text-md">
                Sign in to your Shift-Med Nurse Portal
              </Text>
            </View>

            {/* Input Fields */}
            <View className="flex flex-col gap-4 space-y-4">
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
                <TextInput
                  value={email}
                  onChangeText={handleEmailChange}
                  placeholder="Enter your registered email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">Password</Text>
                <TextInput
                  value={password}
                  onChangeText={handlePasswordChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-md bg-white"
                  secureTextEntry
                />
              </View>
            </View>

            {/* Error Display */}
            {isError && error && (
              <View className="bg-red-50 p-4 rounded-lg border border-red-200">
                <Text className="text-red-600 text-center font-medium">
                  {error?.message ?? 'Login failed'}
                </Text>
              </View>
            )}

            {/* Sign In Button */}
            <Button
              onPress={handleSignIn}
              className="bg-blue-600 py-4 rounded-full mt-6"
              disabled={isLoading || nursesLoading}
            >
              <Text className="text-white text-lg font-semibold text-center">
                {isLoading ? 'Signing In...' : nursesLoading ? 'Loading nurses data...' : 'Sign In'}
              </Text>
            </Button>

            {/* Help Information */}
            <View className="space-y-3 mt-6">
              {/* <View className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <Text className="text-blue-800 text-center text-sm font-medium">
                  Email-Based Authentication
                </Text>
                <Text className="text-blue-700 text-center text-xs mt-1">
                  Only registered nurse emails are allowed to access the system
                </Text>
              </View> */}

              <View className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <Text className="text-yellow-800 text-center text-xs">
                  First time login? Use the default password: auca#123
                </Text>
                <Text className="text-yellow-700 text-center text-xs mt-1">
                  You'll be required to change it on first login
                </Text>
              </View>

              <View className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <Text className="text-gray-700 text-center text-xs">
                  Need help? Contact your administrator for account access or password reset
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}
