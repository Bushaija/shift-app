import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { CreateSwapRequest } from '@/types/api';
import { useNurses } from '@/hooks/api/nurses/use-nurses';
import { useSwappableShifts } from '@/hooks/api/swaps/use-swappable-shifts';

interface SwapRequestModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<CreateSwapRequest, 'original_shift_id'>) => void;
  currentNurseId?: number;
}

export function SwapRequestModal({ isVisible, onClose, onSubmit, currentNurseId }: SwapRequestModalProps) {
  const [swapType, setSwapType] = useState<CreateSwapRequest['swap_type']>('open_request');
  const [reason, setReason] = useState('');
  const [targetNurseId, setTargetNurseId] = useState<number | null>(null);
  const [requestedShiftId, setRequestedShiftId] = useState<number | null>(null);
  const [expiresInHours, setExpiresInHours] = useState('24');

  const { data: nursesData, isLoading: isLoadingNurses } = useNurses({
    enabled: isVisible && swapType === 'full_shift',
  });
  const availableNurses = nursesData?.data.filter(n => n.worker_id !== currentNurseId && n.user.name.toLowerCase() !== 'admin');
  console.log('availableNurses', availableNurses?.map(n => n.user));

  const { data: swappableShiftsData, isLoading: isLoadingShifts } = useSwappableShifts(
    targetNurseId!,
    { enabled: isVisible && swapType === 'full_shift' && targetNurseId !== null }
  );
  const swappableShifts = swappableShiftsData?.data;

  useEffect(() => {
    if (!isVisible) {
        setSwapType('open_request');
        setReason('');
        setTargetNurseId(null);
        setRequestedShiftId(null);
        setExpiresInHours('24');
    }
  }, [isVisible]);

  useEffect(() => {
    setTargetNurseId(null);
    setRequestedShiftId(null);
  }, [swapType]);

  const handleSubmit = () => {
    if (!reason) {
      Alert.alert('Missing Information', 'Please provide a reason for the swap request.');
      return;
    }

    const payload: Omit<CreateSwapRequest, 'original_shift_id'> = {
      reason,
      swap_type: swapType,
      expires_in_hours: parseInt(expiresInHours, 10),
    };

    if (swapType === 'full_shift') {
      if (!targetNurseId) {
        Alert.alert('Missing Information', 'Please select a nurse to swap with.');
        return;
      }
      if (!requestedShiftId) {
        Alert.alert('Missing Information', 'Please select a shift to request.');
        return;
      }
      payload.target_nurse_id = targetNurseId;
      payload.requested_shift_id = requestedShiftId;
    }

    onSubmit(payload);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="w-11/12 bg-white rounded-lg p-5">
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="text-lg font-bold mb-4">Request a Shift Swap</Text>

            <Text className="font-semibold mb-2">Swap Type</Text>
            <View className="flex-row gap-2">
              {(['open_request', 'full_shift'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  className={`px-4 py-2 rounded-full border ${swapType === type ? 'bg-blue-500 border-blue-500' : 'bg-gray-100 border-gray-300'}`}
                  onPress={() => setSwapType(type)}
                >
                  <Text className={`${swapType === type ? 'text-white' : 'text-gray-800'}`}>
                    {type === 'open_request' ? 'Open Request' : 'Direct Swap'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {swapType === 'full_shift' && (
              <View>
                <Text className="font-semibold mb-2 mt-4">Target Nurse</Text>
                {isLoadingNurses ? <ActivityIndicator /> : (
                  <View className="flex-row flex-wrap gap-2">
                    {availableNurses?.map(nurse => (
                      <TouchableOpacity key={nurse.worker_id} onPress={() => setTargetNurseId(nurse.worker_id)} className={`px-3 py-1.5 rounded-full border ${targetNurseId === nurse.worker_id ? 'bg-green-500 border-green-500' : 'bg-gray-100 border-gray-300'}`}>
                        <Text className={`${targetNurseId === nurse.worker_id ? 'text-white' : 'text-gray-800'}`}>{nurse.user.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {targetNurseId && (
                  <View>
                    <Text className="font-semibold mb-2 mt-4">Available Shifts for Swap</Text>
                    {isLoadingShifts ? (
                      <Text>Loading available shifts...</Text>
                    ) : swappableShifts && swappableShifts.length > 0 ? (
                      <View className="flex-row flex-wrap gap-2">
                        {swappableShifts.map(opportunity => {
                          const shift = opportunity.swap_request.requested_shift;
                          if (!shift) return null;

                          return (
                            <TouchableOpacity
                              key={shift.shift_id}
                              onPress={() => setRequestedShiftId(shift.shift_id)}
                              className={`px-3 py-1.5 rounded-full border ${
                                requestedShiftId === shift.shift_id
                                  ? 'bg-green-500 border-green-500'
                                  : 'bg-gray-100 border-gray-300'
                              }`}>
                              <Text
                                className={`${requestedShiftId === shift.shift_id ? 'text-white' : 'text-gray-800'}`}>
                                {new Date(shift.start_time).toLocaleDateString()} - {shift.shift_type}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    ) : (
                      <Text className="text-gray-500">The selected nurse has no available shifts for swapping.</Text>
                    )}
                  </View>
                )}
              </View>
            )}

            <Text className="font-semibold mb-2 mt-4">Reason</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 h-24"
              placeholder="e.g., Family emergency"
              value={reason}
              onChangeText={setReason}
              multiline
            />

            <Text className="font-semibold mb-2 mt-4">Expires In (Hours)</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3"
              placeholder="e.g., 24"
              value={expiresInHours}
              onChangeText={setExpiresInHours}
              keyboardType="numeric"
            />

            <TouchableOpacity className="bg-blue-600 py-3 rounded-lg items-center mt-6" onPress={handleSubmit}>
              <Text className="text-white font-bold">Submit Request</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-200 py-3 rounded-lg items-center mt-2" onPress={onClose}>
              <Text className="text-gray-800 font-bold">Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
