import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, CheckCircle, Moon, Sun } from 'lucide-react-native';
import { useTodayShift } from '@/hooks/api/shifts/use-today-shift';
import { useAuthStore } from '@/stores/auth-store';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { useDepartment } from '@/hooks/api/departments/use-department';

export function TodaysShiftCard({ className = '', shift: providedShift }: { className?: string, shift?: any }) {
  // console.log("shifts: ", providedShift)
  const { nurse } = useAuthStore();
  const { data: fetchedShift, isLoading, error } = useTodayShift(nurse?.worker_id ?? 0);
  const shift = providedShift ?? fetchedShift;

  // normalize across snake_case (API) and camelCase (other sources)
  const normalized = shift ? {
    startTime: shift.start_time ?? shift.startTime,
    endTime: shift.end_time ?? shift.endTime,
    shiftType: shift.shift_type ?? shift.shiftType,
    status: shift.status,
    departmentName: shift.department?.name ?? shift.departmentName ?? undefined,
    departmentId: shift.department?.department_id ?? shift.department_id ?? shift.departmentId,
  } : undefined;

  const { data: departmentResp } = useDepartment(normalized?.departmentId);
  const resolvedDepartmentName = normalized?.departmentName ?? departmentResp?.data?.deptName;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'scheduled':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return <Skeleton className="h-32 w-full rounded-lg" />;
  }

  if (error) {
    return (
      <Card className={`p-4 ${className} bg-red-50 border-red-200`}>
        <Text className="text-lg font-semibold text-red-800">Error</Text>
        <Text className="text-red-600">Could not load today's shift.</Text>
      </Card>
    );
  }

    if (!shift) {
    return (
      <Card className={`p-4 ${className} bg-gray-50 border-gray-200`}>
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-lg font-semibold text-gray-800">Today's Shift</Text>
        </View>
        <Text className="text-gray-500">No shift scheduled for today.</Text>
      </Card>
    );
  }

  if (shift.status === 'cancelled') {
    return (
      <Card className={`p-4 ${className} bg-orange-50 border-orange-200`}>
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-lg font-semibold text-orange-800">Today's Shift</Text>
        </View>
        <Text className="text-orange-600">Today's shift has been cancelled.</Text>
      </Card>
    );
  }

  const status = normalized?.status ?? shift.status;
  const startTimeStr = normalized?.startTime as string | undefined;
  const endTimeStr = normalized?.endTime as string | undefined;
  const departmentName = normalized?.departmentName ?? 'N/A';
  const shiftType = normalized?.shiftType as string | undefined;

  return (
    <Card className={`p-4 ${className} border-2 bg-white shadow-sm`}>
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-lg font-semibold text-gray-900">Today's Shift</Text>
        <Badge
          variant="outline"
          className={`${getStatusColor(status ?? '')} border flex-row items-center gap-1`}
        >
          <CheckCircle size={14} />
          <Text className="text-sm font-medium capitalize">{status}</Text>
        </Badge>
      </View>

      <View className="flex flex-col gap-3">
        <View className="flex-row items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <Text className="text-base text-gray-800 font-medium">
            {startTimeStr && endTimeStr ? `${format(new Date(startTimeStr.replace(' ', 'T')), 'p')} - ${format(new Date(endTimeStr.replace(' ', 'T')), 'p')}` : 'Time not available'}
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <Text className="text-base text-gray-700">{resolvedDepartmentName ?? 'N/A'}</Text>
        </View>

        <View className="flex-row items-center gap-2">
          {shiftType === 'day' ? (
            <Sun className="w-4 h-4 text-yellow-500" />
          ) : (
            <Moon className="w-4 h-4 text-blue-500" />
          )}
          <Text className="text-base text-gray-700 capitalize">{shiftType ?? 'Unknown'} Shift</Text>
        </View>
      </View>
    </Card>
  );
}

