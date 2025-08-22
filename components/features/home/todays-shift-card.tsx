import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, CheckCircle } from 'lucide-react-native';

interface TodaysShiftCardProps {
  startTime?: string;
  endTime?: string;
  location?: string;
  status?: 'confirmed' | 'pending' | 'cancelled';
  className?: string;
}

export function TodaysShiftCard({
  startTime = '7:00 AM',
  endTime = '7:00 PM',
  location = 'ICU Ward A',
  status = 'confirmed',
  className = ''
}: TodaysShiftCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className={`p-4 ${className} border-2 bg-gray-100`}>
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-lg font-semibold text-gray-900">
          Today's Shift
        </Text>
        <Badge
          variant="outline"
          className={`${getStatusColor(status)} border flex-row items-center gap-1`}
        >
          {getStatusIcon(status)}
          <Text className="text-sm font-medium capitalize">
            {status}
          </Text>
        </Badge>
      </View>

      <View className="flex flex-col gap-2">
        <View className="flex-row items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <Text className="text-base text-gray-700">
            {startTime} - {endTime}
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          <MapPin className="w-2 h-2 text-gray-200" />
          <Text className="text-base text-gray-700">
            {location}
          </Text>
        </View>
      </View>
    </Card>
  );
}

