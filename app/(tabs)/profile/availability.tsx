import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Calendar, Save } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/auth-store';
import { apiClient } from '@/services/api/client';

export default function AvailabilityScreen() {
  const { nurse } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [effectiveFrom, setEffectiveFrom] = useState('');
  const [effectiveUntil, setEffectiveUntil] = useState('');
  const [availability, setAvailability] = useState<Record<string, {
    is_available: boolean;
    is_preferred: boolean;
    start_time: string;
    end_time: string;
  }>>({
    monday: { is_available: true, is_preferred: true, start_time: '08:00', end_time: '16:00' },
    tuesday: { is_available: true, is_preferred: true, start_time: '08:00', end_time: '16:00' },
    wednesday: { is_available: true, is_preferred: true, start_time: '08:00', end_time: '16:00' },
    thursday: { is_available: true, is_preferred: true, start_time: '08:00', end_time: '16:00' },
    friday: { is_available: true, is_preferred: true, start_time: '08:00', end_time: '16:00' },
    saturday: { is_available: false, is_preferred: false, start_time: '', end_time: '' },
    sunday: { is_available: false, is_preferred: false, start_time: '', end_time: '' },
  });

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  const handleSave = async () => {
    if (!nurse?.worker_id) {
      Alert.alert('Error', 'Nurse not found');
      return;
    }
    if (!effectiveFrom || !effectiveUntil) {
      Alert.alert('Validation', 'Please provide both Effective From and Effective Until dates (YYYY-MM-DD).');
      return;
    }
    const toTimeWithSeconds = (t: string) => {
      if (!t) return '';
      // Accept HH:mm or HH:mm:ss and normalize to HH:mm:ss
      const parts = t.split(':');
      if (parts.length === 2) return `${t}:00`;
      return t;
    };
    try {
      setSaving(true);
      const payload = daysOfWeek.map((d, idx) => {
        const v = availability[d.key];
        // API expects: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
        // Our array is: [monday, tuesday, wednesday, thursday, friday, saturday, sunday]
        // So map: monday=1, tuesday=2, wednesday=3, thursday=4, friday=5, saturday=6, sunday=0
        let dayOfWeek: number;
        if (d.key === 'sunday') dayOfWeek = 0;
        else if (d.key === 'monday') dayOfWeek = 1;
        else if (d.key === 'tuesday') dayOfWeek = 2;
        else if (d.key === 'wednesday') dayOfWeek = 3;
        else if (d.key === 'thursday') dayOfWeek = 4;
        else if (d.key === 'friday') dayOfWeek = 5;
        else if (d.key === 'saturday') dayOfWeek = 6;
        else dayOfWeek = idx; // fallback
        
        return {
          availability_id: undefined,
          day_of_week: dayOfWeek,
          start_time: toTimeWithSeconds(v.start_time || ''),
          end_time: toTimeWithSeconds(v.end_time || ''),
          is_preferred: !!v.is_preferred,
          is_available: !!v.is_available,
          effective_from: effectiveFrom || '',
          effective_until: effectiveUntil || ''
        };
      });
      
      // DEBUG: Log the payload being sent
      console.log('=== AVAILABILITY API DEBUG ===');
      console.log('Nurse ID:', nurse.worker_id);
      console.log('Effective From:', effectiveFrom);
      console.log('Effective Until:', effectiveUntil);
      console.log('Full Payload:', JSON.stringify(payload, null, 2));
      console.log('============================');
      
      await apiClient.put(`/nurses/${nurse.worker_id}/availability`, payload);
      Alert.alert('Success', 'Your availability has been saved successfully!', [{ text: 'OK' }]);
    } catch (e: any) {
      console.error('=== AVAILABILITY API ERROR ===');
      console.error('Error object:', e);
      console.error('Response data:', e?.response?.data);
      console.error('Response status:', e?.response?.status);
      console.error('Response headers:', e?.response?.headers);
      console.error('============================');
      
      const msg = e?.response?.data?.message || e?.message || 'Failed to save availability';
      Alert.alert('Error', String(msg));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const updateAvailability = (day: string, updates: Partial<{ is_available: boolean; is_preferred: boolean; start_time: string; end_time: string; }>) => {
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], ...updates }
    }));
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1">
        {/* Header */}
        <View className="p-4 bg-white border-b border-gray-200">
          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="p-2 -ml-2"
            >
              <ArrowLeft size={24} color="#374151" />
            </TouchableOpacity>
            <View className="ml-2">
              <Text className="text-2xl font-bold text-gray-900">
                Set Availability
              </Text>
              <Text className="text-gray-600">
                Manage your weekly schedule preferences
              </Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 p-4">
          {/* Effective Dates Selection */}
          <Card className="p-4 mb-4">
            <View className="flex-row items-center mb-3">
              <Calendar size={20} color="#059669" />
              <Text className="text-lg font-semibold text-gray-900 ml-2">
                Effective Date Range
              </Text>
            </View>
            <View className="mt-2">
              <View className="flex-row items-center gap-3 mb-3">
                <Text className="text-gray-700 w-28">Effective From</Text>
                <TextInput
                  className="flex-1 bg-gray-50 rounded-lg p-3 text-gray-900"
                  placeholder="YYYY-MM-DD"
                  value={effectiveFrom}
                  onChangeText={setEffectiveFrom}
                />
              </View>
              <View className="flex-row items-center gap-3">
                <Text className="text-gray-700 w-28">Effective Until</Text>
                <TextInput
                  className="flex-1 bg-gray-50 rounded-lg p-3 text-gray-900"
                  placeholder="YYYY-MM-DD"
                  value={effectiveUntil}
                  onChangeText={setEffectiveUntil}
                />
              </View>
            </View>
          </Card>

          {/* Daily Availability */}
          <Card className="p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Daily Availability
            </Text>

            {daysOfWeek.map((day, index) => (
              <View key={day.key} className={`mb-4 ${index !== daysOfWeek.length - 1 ? 'pb-4 border-b border-gray-100' : ''}`}>
                <Text className="text-base font-medium text-gray-700 mb-2">
                  {day.label}
                </Text>
                <View className="bg-gray-50 rounded-lg p-3">
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center gap-3">
                      <Text className="text-gray-700">Available</Text>
                      <Switch
                        value={availability[day.key].is_available}
                        onValueChange={(v) => updateAvailability(day.key, { is_available: v })}
                      />
                    </View>
                    <View className="flex-row items-center gap-3">
                      <Text className="text-gray-700">Preferred</Text>
                      <Switch
                        value={availability[day.key].is_preferred}
                        onValueChange={(v) => updateAvailability(day.key, { is_preferred: v })}
                      />
                    </View>
                  </View>

                  <View className="flex-row items-center gap-3 mb-2">
                    <Text className="text-gray-700 w-20">Start</Text>
                    <TextInput
                      className="flex-1 bg-white rounded-md p-2 border border-gray-200 text-gray-900"
                      placeholder="HH:MM"
                      value={availability[day.key].start_time}
                      onChangeText={(t) => updateAvailability(day.key, { start_time: t })}
                    />
                  </View>
                  <View className="flex-row items-center gap-3">
                    <Text className="text-gray-700 w-20">End</Text>
                    <TextInput
                      className="flex-1 bg-white rounded-md p-2 border border-gray-200 text-gray-900"
                      placeholder="HH:MM"
                      value={availability[day.key].end_time}
                      onChangeText={(t) => updateAvailability(day.key, { end_time: t })}
                    />
                  </View>
                </View>
              </View>
            ))}
          </Card>

          {/* Action Buttons */}
          <View className="flex-row gap-3 mb-6">
            <TouchableOpacity
              className="flex-1 bg-green-600 px-4 py-3 rounded-xl shadow-lg shadow-green-200 flex-row items-center justify-center"
              onPress={handleSave}
              disabled={saving}
            >
              <Save size={18} color="#FFFFFF" />
              <Text className="text-white font-semibold ml-2">
                {saving ? 'Saving...' : 'Save Availability'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 flex-row items-center justify-center"
              onPress={handleCancel}
            >
              <Text className="text-gray-600 font-medium">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
