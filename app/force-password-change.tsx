// force-password-change.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth-store';
import { usePasswordChange } from '@/hooks/api/auth/use-password-change';
import { Lock, Shield, CheckCircle, AlertCircle } from 'lucide-react-native';

export default function ForcePasswordChangeScreen() {
  const [oldPassword, setOldPassword] = useState('auca#123');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const { nurse, requiresPasswordChange } = useAuthStore();
  const { mutate: changePassword, isPending, isError, error, reset } = usePasswordChange();

  // Redirect if not requiring password change
  useEffect(() => {
    if (!requiresPasswordChange) {
      router.replace('/(tabs)');
    }
  }, [requiresPasswordChange]);

  // Clear error when password fields change
  useEffect(() => {
    if (error && reset) {
      reset();
    }
  }, [newPassword, confirmPassword, oldPassword]);

  // Real-time password validation
  useEffect(() => {
    const checkRequirements = (password: string) => {
      setPasswordRequirements({
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      });
    };
    
    checkRequirements(newPassword);
  }, [newPassword]);

  const validateForm = (): string | null => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return 'All fields are required';
    }

    if (newPassword !== confirmPassword) {
      return 'New passwords do not match';
    }

    const allRequirementsMet = Object.values(passwordRequirements).every(req => req);
    if (!allRequirementsMet) {
      return 'New password does not meet all requirements';
    }

    if (oldPassword === newPassword) {
      return 'New password must be different from current password';
    }

    return null;
  };

  const handlePasswordChange = async () => {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Validation Error', validationError);
      return;
    }

    changePassword(
      { oldPassword, newPassword },
      {
        onSuccess: () => {
          Alert.alert(
            'Success',
            'Password changed successfully! You will be redirected to the dashboard.',
            [
              {
                text: 'OK',
                onPress: () => router.replace('/(tabs)'),
              },
            ]
          );
        },
        onError: (error) => {
          // Error is handled by the UI below
          console.log('Password change failed:', error.message);
        },
      }
    );
  };

  const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
    <View className="flex-row items-center space-x-2 py-1">
      {met ? (
        <CheckCircle size={16} color="#10B981" />
      ) : (
        <AlertCircle size={16} color="#EF4444" />
      )}
      <Text className={`text-sm ${met ? 'text-green-700' : 'text-red-600'}`}>
        {text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 justify-center px-6">
        <Card className="p-8 bg-white rounded-2xl shadow-lg">
          <View className="space-y-6">
            {/* Header */}
            <View className="items-center space-y-3 mb-6">
              <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center">
                <Shield size={32} color="#3B82F6" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">Change Password</Text>
              <Text className="text-gray-600 text-center text-sm">
                Welcome! Please change your default password to continue
              </Text>
            </View>

            {/* Nurse Info */}
            {nurse && (
              <View className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <Text className="text-blue-800 text-center font-medium">
                  {nurse.user.name} - {nurse.specialization}
                </Text>
                <Text className="text-blue-600 text-center text-sm mt-1">
                  Employee ID: {nurse.employee_id}
                </Text>
              </View>
            )}

            {/* Password Fields */}
            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">Current Password</Text>
                <TextInput
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900"
                  secureTextEntry
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">New Password</Text>
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900"
                  secureTextEntry
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">Confirm New Password</Text>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900"
                  secureTextEntry
                />
              </View>
            </View>

            {/* Password Requirements */}
            <View className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <Text className="text-sm font-medium text-gray-700 mb-3">Password Requirements:</Text>
              <View className="space-y-1">
                <RequirementItem 
                  met={passwordRequirements.length} 
                  text="At least 8 characters long" 
                />
                <RequirementItem 
                  met={passwordRequirements.uppercase} 
                  text="One uppercase letter (A-Z)" 
                />
                <RequirementItem 
                  met={passwordRequirements.lowercase} 
                  text="One lowercase letter (a-z)" 
                />
                <RequirementItem 
                  met={passwordRequirements.number} 
                  text="One number (0-9)" 
                />
                <RequirementItem 
                  met={passwordRequirements.special} 
                  text="One special character (!@#$%^&*)" 
                />
              </View>
            </View>

            {/* Error Display */}
            {isError && error && (
              <View className="bg-red-50 p-4 rounded-lg border border-red-200">
                <Text className="text-red-600 text-center text-sm font-medium">
                  {error?.message ?? 'Password change failed'}
                </Text>
              </View>
            )}

            {/* Submit Button */}
            <Button
              onPress={handlePasswordChange}
              className="bg-blue-600 py-4 rounded-full"
              disabled={isPending || !Object.values(passwordRequirements).every(req => req)}
            >
              <Text className="text-white text-lg font-semibold text-center">
                {isPending ? 'Changing Password...' : 'Change Password'}
              </Text>
            </Button>

            {/* Help Text */}
            <View className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <Text className="text-yellow-800 text-center text-xs">
                This is your first login. You must change your password to continue using the app.
              </Text>
            </View>
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}