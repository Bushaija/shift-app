import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth-store';

export default function SignUpScreen() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    licenseType: 'RN',
    licenseNumber: '',
  });

  const { signUp, isLoading, error, clearError, isAuthenticated } = useAuthStore();

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

  const handleSignUp = async () => {
    const { firstName, lastName, email, password, confirmPassword, phone, licenseType, licenseNumber } = formData;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      await signUp({
        firstName,
        lastName,
        email,
        password,
        phone,
        licenseType,
        licenseNumber,
      });
      // Navigation will be handled by the useEffect above
    } catch (error) {
      // Error is handled by the store
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingVertical: 20 }}>
        <View className="px-6">
          <Card className="p-8 bg-white rounded-2xl shadow-lg">
            <View className="space-y-6">
              <View className="items-center space-y-2">
                <Text className="text-3xl font-bold text-gray-900">Create Account</Text>
                <Text className="text-gray-600 text-center">
                  Join our healthcare staffing platform
                </Text>
              </View>

              <View className="space-y-4">
                <View className="flex-row space-x-3">
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-700 mb-2">First Name *</Text>
                    <TextInput
                      value={formData.firstName}
                      onChangeText={(value) => updateFormData('firstName', value)}
                      placeholder="First name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-700 mb-2">Last Name *</Text>
                    <TextInput
                      value={formData.lastName}
                      onChangeText={(value) => updateFormData('lastName', value)}
                      placeholder="Last name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white"
                    />
                  </View>
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">Email *</Text>
                  <TextInput
                    value={formData.email}
                    onChangeText={(value) => updateFormData('email', value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">Phone</Text>
                  <TextInput
                    value={formData.phone}
                    onChangeText={(value) => updateFormData('phone', value)}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white"
                    keyboardType="phone-pad"
                  />
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">License Type *</Text>
                  <TextInput
                    value={formData.licenseType}
                    onChangeText={(value) => updateFormData('licenseType', value)}
                    placeholder="RN, LPN, CNA, etc."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white"
                  />
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">License Number</Text>
                  <TextInput
                    value={formData.licenseNumber}
                    onChangeText={(value) => updateFormData('licenseNumber', value)}
                    placeholder="Enter your license number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white"
                  />
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">Password *</Text>
                  <TextInput
                    value={formData.password}
                    onChangeText={(value) => updateFormData('password', value)}
                    placeholder="Create a password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white"
                    secureTextEntry
                  />
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">Confirm Password *</Text>
                  <TextInput
                    value={formData.confirmPassword}
                    onChangeText={(value) => updateFormData('confirmPassword', value)}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white"
                    secureTextEntry
                  />
                </View>
              </View>

              {error && (
                <View className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <Text className="text-red-600 text-center">{error}</Text>
                </View>
              )}

              <Button
                onPress={handleSignUp}
                className="bg-blue-600 py-4 rounded-lg"
                disabled={isLoading}
              >
                <Text className="text-white text-lg font-semibold text-center">
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </Button>

              <TouchableOpacity onPress={() => router.push('/auth/signin')}>
                <Text className="text-blue-600 text-center">
                  Already have an account? Sign in
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
