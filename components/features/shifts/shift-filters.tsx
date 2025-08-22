import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react-native';
import { useShiftsStore } from '@/stores/shifts-store';

interface ShiftFiltersProps {
  className?: string;
}

export function ShiftFilters({ className = '' }: ShiftFiltersProps) {
  const { filters, searchQuery, setFilters, setSearchQuery, clearFilters } = useShiftsStore();
  const [showFilters, setShowFilters] = useState(false);

  const licenseTypes = ['RN', 'LPN', 'CNA', 'NP', 'PA'];
  const departments = ['Emergency', 'ICU', 'Medical Surgical', 'Pediatrics', 'OR'];

  const toggleLicenseType = (type: string) => {
    const currentTypes = filters.licenseType;
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    setFilters({ licenseType: newTypes });
  };

  const toggleDepartment = (dept: string) => {
    const currentDepts = filters.department;
    const newDepts = currentDepts.includes(dept)
      ? currentDepts.filter(t => t !== dept)
      : [...currentDepts, dept];
    setFilters({ department: newDepts });
  };

  const toggleUrgent = () => {
    const newValue = filters.isUrgent === null ? true : filters.isUrgent === true ? false : null;
    setFilters({ isUrgent: newValue });
  };

  const hasActiveFilters = () => {
    return filters.licenseType.length > 0 ||
      filters.department.length > 0 ||
      filters.isUrgent !== null ||
      searchQuery.length > 0;
  };

  return (
    <View className={`space-y-4 ${className}`}>
      {/* Search and Filter Header */}
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-lg font-semibold text-gray-800">Search & Filter</Text>
        {hasActiveFilters() && (
          <TouchableOpacity
            className="bg-gray-100 px-3 py-1 rounded-full"
            onPress={clearFilters}
          >
            <Text className="text-sm text-gray-600">Clear all</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Search Bar */}
      <View className="flex-row gap-3">
        <View className="flex-1 flex-row items-center bg-white px-8 rounded-full py-1 border border-gray-200 shadow-sm">
          <Search size={16} color="#6B7280" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search shifts by facility, department, or location..."
            className="ml-3 flex-1 text-gray-900 text-base"
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={18} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          className={`flex justify-center p-3 items-center rounded-full border-2 ${showFilters
            ? 'bg-blue-600 border-blue-600 shadow-lg'
            : 'bg-white border-gray-200 shadow-sm'
            }`}
          onPress={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal
            size={18}
            color={showFilters ? "#FFFFFF" : "#6B7280"}
          />
        </TouchableOpacity>
      </View>

      {/* Active Filters Display */}
      {hasActiveFilters() && (
        <View className="bg-blue-50 p-3 rounded-xl border border-blue-200">
          <Text className="text-sm font-medium text-blue-800 mb-2">Active Filters:</Text>
          <View className="flex-row flex-wrap gap-2">
            {filters.licenseType.map(type => (
              <TouchableOpacity
                key={type}
                className="bg-blue-100 px-3 py-2 rounded-full flex-row items-center border border-blue-200"
                onPress={() => toggleLicenseType(type)}
              >
                <Text className="text-blue-700 text-sm font-medium mr-2">{type}</Text>
                <X size={14} color="#1D4ED8" />
              </TouchableOpacity>
            ))}
            {filters.department.map(dept => (
              <TouchableOpacity
                key={dept}
                className="bg-green-100 px-3 py-2 rounded-full flex-row items-center border border-green-200"
                onPress={() => toggleDepartment(dept)}
              >
                <Text className="text-green-700 text-sm font-medium mr-2">{dept}</Text>
                <X size={14} color="#059669" />
              </TouchableOpacity>
            ))}
            {filters.isUrgent !== null && (
              <TouchableOpacity
                className="bg-red-100 px-3 py-2 rounded-full flex-row items-center border border-red-200"
                onPress={toggleUrgent}
              >
                <Text className="text-red-700 text-sm font-medium mr-2">Urgent Only</Text>
                <X size={14} color="#DC2626" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Filter Options */}
      {showFilters && (
        <View className="bg-white p-5 rounded-2xl border border-gray-200 shadow-lg space-y-6">
          {/* License Types */}
          <View>
            <Text className="text-base font-semibold text-gray-900 mb-3">License Type</Text>
            <View className="flex-row flex-wrap gap-3">
              {licenseTypes.map(type => (
                <TouchableOpacity
                  key={type}
                  className={`px-4 py-3 rounded-xl border-2 ${filters.licenseType.includes(type)
                    ? 'bg-blue-50 border-blue-300 shadow-sm'
                    : 'bg-gray-50 border-gray-200'
                    }`}
                  onPress={() => toggleLicenseType(type)}
                >
                  <Text className={`text-sm font-medium ${filters.licenseType.includes(type) ? 'text-blue-700' : 'text-gray-600'
                    }`}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Departments */}
          <View>
            <Text className="text-base font-semibold text-gray-900 mb-3">Department</Text>
            <View className="flex-row flex-wrap gap-3">
              {departments.map(dept => (
                <TouchableOpacity
                  key={dept}
                  className={`px-4 py-3 rounded-xl border-2 ${filters.department.includes(dept)
                    ? 'bg-green-50 border-green-300 shadow-sm'
                    : 'bg-gray-50 border-gray-200'
                    }`}
                  onPress={() => toggleDepartment(dept)}
                >
                  <Text className={`text-sm font-medium ${filters.department.includes(dept) ? 'text-green-700' : 'text-gray-600'
                    }`}>
                    {dept}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Urgent Only */}
          <View>
            <TouchableOpacity
              className={`flex-row items-center p-4 rounded-xl border-2 ${filters.isUrgent === true
                ? 'bg-red-50 border-red-300 shadow-sm'
                : 'bg-gray-50 border-gray-200'
                }`}
              onPress={toggleUrgent}
            >
              <View className={`w-5 h-5 rounded border-2 mr-4 ${filters.isUrgent === true
                ? 'bg-red-600 border-red-600'
                : 'border-gray-300'
                }`}>
                {filters.isUrgent === true && (
                  <View className="w-2.5 h-2.5 bg-white rounded-sm m-0.5" />
                )}
              </View>
              <View className="flex-1">
                <Text className={`text-base font-medium ${filters.isUrgent === true ? 'text-red-700' : 'text-gray-700'
                  }`}>
                  Urgent shifts only
                </Text>
                <Text className={`text-sm ${filters.isUrgent === true ? 'text-red-600' : 'text-gray-500'
                  }`}>
                  Show only high-priority shifts that need immediate attention
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
