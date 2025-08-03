import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Search, Filter, X } from 'lucide-react-native';
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
      ? currentDepts.filter(d => d !== dept)
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
      {/* Search Bar */}
      <View className="flex-row gap-2 space-x-3">
        <View className="flex-1 flex-row items-center bg-white px-4 rounded-full border border-gray-200">
          <Search size={18} color="#6B7280" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search shifts..."
            className="ml-2 flex-1 text-gray-900"
            placeholderTextColor="#6B7280"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          className={`p-3 rounded-full border ${showFilters ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200'}`}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color={showFilters ? "#FFFFFF" : "#6B7280"} />
        </TouchableOpacity>
      </View>

      {/* Active Filters Display */}
      {hasActiveFilters() && (
        <View className="flex-row flex-wrap gap-2">
          {filters.licenseType.map(type => (
            <TouchableOpacity
              key={type}
              className="bg-blue-100 px-3 py-1 rounded-full flex-row items-center"
              onPress={() => toggleLicenseType(type)}
            >
              <Text className="text-blue-600 text-sm mr-1">{type}</Text>
              <X size={12} color="#2563EB" />
            </TouchableOpacity>
          ))}
          {filters.department.map(dept => (
            <TouchableOpacity
              key={dept}
              className="bg-green-100 px-3 py-1 rounded-full flex-row items-center"
              onPress={() => toggleDepartment(dept)}
            >
              <Text className="text-green-600 text-sm mr-1">{dept}</Text>
              <X size={12} color="#059669" />
            </TouchableOpacity>
          ))}
          {filters.isUrgent !== null && (
            <TouchableOpacity
              className="bg-red-100 px-3 py-1 rounded-full flex-row items-center"
              onPress={toggleUrgent}
            >
              <Text className="text-red-600 text-sm mr-1">Urgent Only</Text>
              <X size={12} color="#DC2626" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className="bg-gray-100 px-3 py-1 rounded-full"
            onPress={clearFilters}
          >
            <Text className="text-gray-600 text-sm">Clear all</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Filter Options */}
      {showFilters && (
        <View className="flex flex-col gap-2 bg-white p-4 rounded-xl border border-gray-200 space-y-4 mt-1">
          {/* License Types */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">License Type</Text>
            <View className="flex-row flex-wrap gap-2">
              {licenseTypes.map(type => (
                <TouchableOpacity
                  key={type}
                  className={`px-3 py-1 rounded-full border ${filters.licenseType.includes(type)
                      ? 'bg-blue-100 border-blue-300'
                      : 'bg-gray-50 border-gray-200'
                    }`}
                  onPress={() => toggleLicenseType(type)}
                >
                  <Text className={`text-sm ${filters.licenseType.includes(type) ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Departments */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">Department</Text>
            <View className="flex-row flex-wrap gap-2">
              {departments.map(dept => (
                <TouchableOpacity
                  key={dept}
                  className={`px-3 py-1 rounded-full border ${filters.department.includes(dept)
                      ? 'bg-green-100 border-green-300'
                      : 'bg-gray-50 border-gray-200'
                    }`}
                  onPress={() => toggleDepartment(dept)}
                >
                  <Text className={`text-sm ${filters.department.includes(dept) ? 'text-green-600' : 'text-gray-600'
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
              className={`flex-row items-center p-3 rounded-lg border ${filters.isUrgent === true
                  ? 'bg-red-50 border-red-200'
                  : 'bg-gray-50 border-gray-200'
                }`}
              onPress={toggleUrgent}
            >
              <View className={`w-4 h-4 rounded border-2 mr-3 ${filters.isUrgent === true
                  ? 'bg-red-600 border-red-600'
                  : 'border-gray-300'
                }`}>
                {filters.isUrgent === true && (
                  <View className="w-2 h-2 bg-white rounded-sm m-0.5" />
                )}
              </View>
              <Text className={`${filters.isUrgent === true ? 'text-red-600' : 'text-gray-600'
                }`}>
                Urgent shifts only
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
