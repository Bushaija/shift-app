import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth-store';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn, isLoading, error, clearError, isAuthenticated } = useAuthStore();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  // Clear error when component mounts
  useEffect(() => {
    clearError();
  }, []);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      await signIn(email, password);
      // Navigation will be handled by the useEffect above
    } catch (error) {
      // Error is handled by the store
    }
  };

  // For demo purposes, you can use any email/password
  const handleDemoSignIn = async () => {
    setEmail('demo@example.com');
    setPassword('password123');
    try {
      await signIn('demo@example.com', 'password123');
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 justify-center px-6">
        <Card className="p-8 bg-white rounded-2xl shadow-lg">
          <View className="space-y-6">
            <View className="items-center space-y-2 mb-8">
              <Text className="text-2xl font-bold text-gray-900">Welcome Back</Text>
              <Text className="text-gray-600 text-center text-md">
                Sign in to your Shift-Med account
              </Text>
            </View>

            <View className="flex flex-col gap-4 space-y-4">
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">Password</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 text-black border border-gray-300 rounded-md bg-white"
                  secureTextEntry
                />
              </View>
            </View>

            {error && (
              <View className="bg-red-50 p-3 rounded-lg border border-red-200 mt-8">
                <Text className="text-red-600 text-center">{error}</Text>
              </View>
            )}

            <Button
              onPress={handleSignIn}
              className="bg-blue-600 py-4 rounded-full mt-8"
              disabled={isLoading}
            >
              <Text className="text-white text-lg font-semibold text-center">
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </Button>

            {/* Demo sign-in button for testing */}
            <TouchableOpacity
              onPress={handleDemoSignIn}
              className="bg-green-600 py-3 rounded-full mt-4"
              disabled={isLoading}
            >
              <Text className="text-white text-center font-medium">
                Demo Sign In (Any credentials work)
              </Text>
            </TouchableOpacity>

            <View className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
              <Text className="text-blue-800 text-center text-sm">
                Need help? Contact your administrator for account access or password reset.
              </Text>
            </View>
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}
