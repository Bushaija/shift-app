import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/auth-store';
import { AlertTriangle, Home } from 'lucide-react-native';

export default function NotFoundScreen() {
  const { isAuthenticated } = useAuthStore();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-6">
        <View className="items-center space-y-6">

          <AlertTriangle size={64} color="#6B7280" />

          <View className="items-center space-y-2">
            <Text className="text-2xl font-bold text-gray-900">
              Page Not Found
            </Text>
            <Text className="text-gray-600 text-center">
              The page you're looking for doesn't exist or has been moved.
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              const target = isAuthenticated ? '/(tabs)' : '/auth/signin';
              try {
                router.replace(target);
              } catch { }
              setTimeout(() => {
                try { router.push(target); } catch { }
              }, 50);
            }}
            className="bg-blue-600 px-6 py-3 rounded-lg flex-row items-center"
          >
            <Home size={20} color="#FFFFFF" />
            <Text className="text-white font-medium ml-2">Go to Home!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
