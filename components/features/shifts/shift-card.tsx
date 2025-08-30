import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/card';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Calendar, 
  Building2, 
  AlertTriangle, 
  Users,
  Target,
  CheckCircle
} from 'lucide-react-native';
import { Shift } from '@/stores/shifts-store';
import { useShiftsStore } from '@/stores/shifts-store';
import { router } from 'expo-router';

interface ShiftCardProps {
  shift: Shift;
  onApply?: (shiftId: string) => void;
  className?: string;
}

export function ShiftCard({ shift, onApply, className = '' }: ShiftCardProps) {
  const { applyForShift, isLoading } = useShiftsStore();

  const handleApply = async () => {
    if (onApply) {
      onApply(shift.id);
    } else {
      await applyForShift(shift.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const getStaffingStatus = () => {
    if (!shift.requiredNurses || !shift.assignedNurses) return null;
    
    if (shift.assignedNurses >= shift.requiredNurses) {
      return { text: 'Fully Staffed', color: 'text-green-600', bgColor: 'bg-green-100' };
    } else {
      const shortage = shift.requiredNurses - shift.assignedNurses;
      return { 
        text: `Need ${shortage} more`, 
        color: 'text-red-600', 
        bgColor: 'bg-red-100' 
      };
    }
  };

  const staffingStatus = getStaffingStatus();

  return (
    <TouchableOpacity onPress={() => router.push(`/(tabs)/shifts/${shift.id}`)}>
      <Card className={`p-5 bg-white rounded-2xl border border-gray-200 shadow-sm ${className}`}>
        {/* Header with Shift Title and Urgency */}
        <View className="flex-row justify-between items-start mb-4">
          <View className="flex-1 pr-3">
            {/* Shift Title */}
            <Text className="text-lg font-bold text-gray-900 mb-1">
              {shift.title}
            </Text>
            {/* Facility Name */}
            <View className="flex-row items-center mb-1">
              <Building2 size={14} color="#6B7280" />
              <Text className="text-gray-600 font-medium ml-2">{shift.facilityName}</Text>
            </View>
            {/* Department */}
            {shift.department && (
              <Text className="text-gray-500 text-sm">{shift.department}</Text>
            )}
          </View>
          
          {/* Status Indicators */}
          <View className="flex-col items-end gap-2">
            {/* Urgency Badge */}
            {shift.isUrgent && (
              <View className="bg-red-100 px-3 py-1.5 rounded-full border border-red-200">
                <View className="flex-row items-center">
                  <AlertTriangle size={14} color="#DC2626" />
                  <Text className="text-red-600 text-xs font-bold ml-1">URGENT</Text>
                </View>
              </View>
            )}
            
            {/* Staffing Status */}
            {staffingStatus && (
              <View className={`px-3 py-1.5 rounded-full border ${staffingStatus.bgColor} ${
                staffingStatus.text.includes('Need') ? 'border-red-200' : 'border-green-200'
              }`}>
                <View className="flex-row items-center">
                  {staffingStatus.text.includes('Need') ? (
                    <Users size={12} color="#DC2626" />
                  ) : (
                    <CheckCircle size={12} color="#059669" />
                  )}
                  <Text className={`text-xs font-medium ml-1 ${staffingStatus.color}`}>
                    {staffingStatus.text}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Date & Time */}
        <View className="flex-row items-center mb-3">
          <Calendar size={18} color="#6B7280" />
          <Text className="ml-3 text-gray-700 font-medium text-base">
            {formatDate(shift.shiftDate)} • {shift.startTime} - {shift.endTime}
          </Text>
          {shift.totalHours && (
            <Text className="ml-2 text-blue-600 font-semibold">
              ({shift.totalHours}h)
            </Text>
          )}
        </View>

        {/* Compensation Info */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center flex-1">
            <DollarSign size={18} color="#10B981" />
            <Text className="ml-2 text-green-700 font-bold text-lg">
              RWF {shift.hourlyRate ? shift.hourlyRate.toLocaleString() : 'TBD'}/hr
            </Text>
            {/* Total estimated pay */}
            {shift.hourlyRate && shift.totalHours && (
              <Text className="ml-3 text-gray-600 font-medium">
                (Est. RWF {(shift.hourlyRate * shift.totalHours).toLocaleString()})
              </Text>
            )}
          </View>
        </View>

        {/* Additional Info Row */}
        <View className="flex-row items-center justify-between mb-4">
          {/* Location (if available) */}
          {shift.location && (
            <View className="flex-row items-center flex-1">
              <MapPin size={16} color="#6B7280" />
              <Text className="ml-2 text-gray-600 text-sm">
                {shift.location}
                {shift.distance ? ` (${shift.distance} mi)` : ''}
              </Text>
            </View>
          )}

          {/* Required vs Assigned Nurses */}
          {shift.requiredNurses && (
            <View className="flex-row items-center">
              <Target size={16} color="#6B7280" />
              <Text className="ml-2 text-gray-600 text-sm">
                {shift.assignedNurses || 0}/{shift.requiredNurses} nurses
              </Text>
            </View>
          )}
        </View>

        {/* Description (if available) */}
        {shift.description && shift.description.trim() !== '' && (
          <View className="mb-4 p-3 bg-gray-50 rounded-lg">
            <Text className="text-gray-700 text-sm">{shift.description}</Text>
          </View>
        )}

        {/* Apply Button */}
        <View className="flex-row justify-end">
          <TouchableOpacity
            className={`px-6 py-3 rounded-xl shadow-lg ${
              shift.isUrgent
                ? 'bg-red-600 shadow-red-200'
                : 'bg-blue-600 shadow-blue-200'
            }`}
            onPress={handleApply}
            disabled={isLoading}
          >
            <View className="flex-row items-center">
              {shift.isUrgent && (
                <AlertTriangle size={16} color="#FFFFFF" className="mr-2" />
              )}
              <Text className="text-white font-semibold text-base">
                {isLoading ? 'Applying...' : shift.isUrgent ? 'Apply Now' : 'Apply'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Card>
    </TouchableOpacity>
  );
}