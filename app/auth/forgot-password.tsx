import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth-store';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { forgotPassword, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleBackToSignIn = () => {
    clearError();
    router.push('/auth/signin');
  };

  if (isSubmitted) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center px-6">
          <Card className="p-8 bg-white rounded-2xl shadow-lg">
            <View className="space-y-6">
              <View className="items-center space-y-2">
                <Text className="text-3xl font-bold text-gray-900">Check Your Email</Text>
                <Text className="text-gray-600 text-center">
                  We've sent a password reset link to {email}
                </Text>
              </View>

              <Text className="text-gray-600 text-center">
                Please check your email and follow the instructions to reset your password.
              </Text>

              <Button
                onPress={handleBackToSignIn}
                className="bg-blue-600 py-4 rounded-lg"
              >
                <Text className="text-white text-lg font-semibold text-center">
                  Back to Sign In
                </Text>
              </Button>
            </View>
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 justify-center px-6">
        <Card className="p-8 bg-white rounded-2xl shadow-lg">
          <View className="space-y-6">
            <View className="items-center space-y-2">
              <Text className="text-3xl font-bold text-gray-900">Reset Password</Text>
              <Text className="text-gray-600 text-center">
                Enter your email to receive a password reset link
              </Text>
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {error && (
              <View className="bg-red-50 p-3 rounded-lg border border-red-200">
                <Text className="text-red-600 text-center">{error}</Text>
              </View>
            )}

            <Button
              onPress={handleSubmit}
              className="bg-blue-600 py-4 rounded-lg"
              disabled={isLoading}
            >
              <Text className="text-white text-lg font-semibold text-center">
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Text>
            </Button>

            <TouchableOpacity onPress={handleBackToSignIn}>
              <Text className="text-blue-600 text-center">
                Back to Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}
