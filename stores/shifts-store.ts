import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getItem, setItem } from '@/lib/storage';
import { useNotificationsStore } from './notifications-store';

export interface Shift {
  id: string;
  facilityId: string;
  facilityName: string;
  title: string;
  description?: string;
  department: string;
  licenseType: string;
  shiftDate: string;
  startTime: string;
  endTime: string;
  hourlyRate: number;
  totalHours: number;
  isUrgent: boolean;
  status: 'open' | 'filled' | 'cancelled';
  createdAt: string;
  distance?: number;
  location?: string;
  requiredNurses?: number;
  assignedNurses?: number;
  staffingLevel?: 'understaffed' | 'adequate' | 'overstaffed';
}

export interface Booking {
  id: string;
  userId: string;
  shiftId: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  bookedAt: string;
  confirmedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  notes?: string;
  shift?: Shift;
}

interface ShiftsState {
  // Available shifts
  availableShifts: Shift[];
  filteredShifts: Shift[];

  // User bookings
  userBookings: Booking[];

  // UI state
  isLoading: boolean;
  error: string | null;

  // Filters
  filters: {
    licenseType: string[];
    distance: number;
    dateRange: { start: string; end: string } | null;
    department: string[];
    isUrgent: boolean | null;
  };

  // Search
  searchQuery: string;
}

interface ShiftsActions {
  // Shifts management
  fetchAvailableShifts: () => Promise<void>;
  fetchUserBookings: () => Promise<void>;
  applyForShift: (shiftId: string) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;

  // Filtering and search
  setFilters: (filters: Partial<ShiftsState['filters']>) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;

  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// Helper function to calculate hours between two datetime strings
const calculateHours = (startTime: string, endTime: string): number => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffInMs = end.getTime() - start.getTime();
  return Math.round(diffInMs / (1000 * 60 * 60) * 100) / 100; // Round to 2 decimal places
};

// Helper function to format shift type
const formatShiftType = (shiftType: string): string => {
  const typeMap: { [key: string]: string } = {
    'day': 'Day Shift',
    'night': 'Night Shift',
    'evening': 'Evening Shift',
    'morning': 'Morning Shift'
  };
  return typeMap[shiftType.toLowerCase()] || `${shiftType.charAt(0).toUpperCase() + shiftType.slice(1)} Shift`;
};

// Mock facility names - in production, you'd fetch these from an API
const getFacilityName = (departmentId: number): string => {
  const facilityMap: { [key: number]: string } = {
    1: 'City General Hospital',
    2: 'Memorial Medical Center',
    3: 'Regional Health Center',
    4: 'University Hospital'
  };
  return facilityMap[departmentId] || `Facility ${departmentId}`;
};

// Mock department names - in production, you'd fetch these from an API
const getDepartmentName = (departmentId: number): string => {
  const departmentMap: { [key: number]: string } = {
    1: 'General Ward',
    2: 'Emergency Department',
    3: 'ICU',
    4: 'Pediatrics'
  };
  return departmentMap[departmentId] || `Department ${departmentId}`;
};

// Mock hourly rates - in production, this would come from your API
const getHourlyRate = (shiftType: string, isUrgent: boolean): number => {
  const baseRates: { [key: string]: number } = {
    'day': 3500,
    'night': 4000,
    'evening': 3800,
    'morning': 3500
  };
  const baseRate = baseRates[shiftType.toLowerCase()] || 3500;
  return isUrgent ? baseRate * 1.5 : baseRate; // 50% premium for urgent shifts
};

export const useShiftsStore = create<ShiftsState & ShiftsActions>()(
  persist(
    (set, get) => ({
      // Initial state
      availableShifts: [],
      filteredShifts: [],
      userBookings: [],
      isLoading: false,
      error: null,
      filters: {
        licenseType: [],
        distance: 50,
        dateRange: null,
        department: [],
        isUrgent: null,
      },
      searchQuery: '',

      // Shifts management
      fetchAvailableShifts: async () => {
        set({ isLoading: true, error: null });

        try {
          // Call the real API
          const response = await import('@/services/api/client').then(m => m.apiClient.get<any>('/shifts'));
          
          // Map API data to Shift[]
          const apiShifts = response.data as any[];
          const shifts: Shift[] = apiShifts
            .filter(item => item.status !== 'cancelled') // Filter out cancelled shifts
            .map((item) => {
              const totalHours = calculateHours(item.startTime, item.endTime);
              const isUrgent = item.status === 'understaffed';
              const hourlyRate = getHourlyRate(item.shiftType, isUrgent);

              return {
                id: String(item.shiftId),
                facilityId: String(item.departmentId),
                facilityName: getFacilityName(item.departmentId),
                title: formatShiftType(item.shiftType),
                description: item.notes || '',
                department: getDepartmentName(item.departmentId),
                licenseType: 'RN', // Default for now - you may want to derive this from requiredSkills
                shiftDate: item.startTime.split(' ')[0],
                startTime: item.startTime.split(' ')[1].substring(0, 5), // HH:mm format
                endTime: item.endTime.split(' ')[1].substring(0, 5), // HH:mm format
                hourlyRate: hourlyRate,
                totalHours: totalHours,
                isUrgent: isUrgent,
                status: item.status === 'filled' ? 'filled' : 'open',
                createdAt: item.createdAt,
                distance: undefined,
                location: undefined,
                requiredNurses: item.requiredNurses,
                assignedNurses: item.assignedNurses,
                staffingLevel: item.status === 'understaffed' ? 'understaffed' : 
                             item.assignedNurses >= item.requiredNurses ? 'adequate' : 'understaffed'
              };
            });

          console.log("Available shifts: ", shifts);

          set({
            availableShifts: shifts,
            filteredShifts: shifts,
            isLoading: false
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch shifts',
          });
        }
      },

      fetchUserBookings: async () => {
        set({ isLoading: true, error: null });

        try {
          // Get nurseId from auth store
          const nurse = await import('./auth-store').then(m => m.useAuthStore.getState().nurse);
          const nurseId = nurse?.worker_id;
          if (!nurseId) throw new Error('No nurse ID found');

          // Call the real API with nurseId as query param
          const response = await import('@/services/api/client').then(m => m.apiClient.get<any>(`/shifts?nurseId=${nurseId}`));
          const apiShifts = response.data as any[];

          // Map API data to Booking[]
          const bookings: Booking[] = apiShifts.map((item) => {
            const totalHours = calculateHours(item.startTime, item.endTime);
            const isUrgent = item.status === 'understaffed';
            const hourlyRate = getHourlyRate(item.shiftType, isUrgent);
            return {
              id: String(item.shiftId),
              userId: String(nurseId),
              shiftId: String(item.shiftId),
              status: item.status === 'cancelled' ? 'cancelled' : (item.status === 'completed' ? 'completed' : (item.status === 'scheduled' ? 'confirmed' : 'pending')),
              bookedAt: item.createdAt,
              confirmedAt: item.updatedAt,
              shift: {
                id: String(item.shiftId),
                facilityId: String(item.departmentId),
                facilityName: getFacilityName(item.departmentId),
                title: formatShiftType(item.shiftType),
                description: item.notes || '',
                department: getDepartmentName(item.departmentId),
                licenseType: 'RN',
                shiftDate: item.startTime.split(' ')[0],
                startTime: item.startTime.split(' ')[1].substring(0, 5),
                endTime: item.endTime.split(' ')[1].substring(0, 5),
                hourlyRate: hourlyRate,
                totalHours: totalHours,
                isUrgent: isUrgent,
                status: item.status === 'filled' ? 'filled' : 'open',
                createdAt: item.createdAt,
                distance: undefined,
                location: undefined,
                requiredNurses: item.requiredNurses,
                assignedNurses: item.assignedNurses,
                staffingLevel: item.status === 'understaffed' ? 'understaffed' : 
                  item.assignedNurses >= item.requiredNurses ? 'adequate' : 'understaffed'
              }
            };
          });

          set({
            userBookings: bookings,
            isLoading: false
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch bookings',
          });
        }
      },

      applyForShift: async (shiftId: string) => {
        set({ isLoading: true, error: null });

        try {
          // TODO: Replace with actual API call
          // await shiftsApi.applyForShift(shiftId);

          // Mock delay
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Add to user bookings
          const shift = get().availableShifts.find(s => s.id === shiftId);
          if (shift) {
            const newBooking: Booking = {
              id: Date.now().toString(),
              userId: '1',
              shiftId,
              status: 'pending',
              bookedAt: new Date().toISOString(),
              shift,
            };

            set(state => ({
              userBookings: [...state.userBookings, newBooking],
              isLoading: false,
            }));

            // Send notification
            const notificationsStore = useNotificationsStore.getState();
            notificationsStore.notifyBookingPending(shift.title, shift.facilityName);
          }

        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to apply for shift',
          });
        }
      },

      cancelBooking: async (bookingId: string) => {
        set({ isLoading: true, error: null });

        try {
          // TODO: Replace with actual API call
          // await shiftsApi.cancelBooking(bookingId);

          // Mock delay
          await new Promise(resolve => setTimeout(resolve, 500));

          const booking = get().userBookings.find(b => b.id === bookingId);

          set(state => ({
            userBookings: state.userBookings.map(booking =>
              booking.id === bookingId
                ? { ...booking, status: 'cancelled', cancelledAt: new Date().toISOString() }
                : booking
            ),
            isLoading: false,
          }));

          // Send notification
          if (booking?.shift) {
            const notificationsStore = useNotificationsStore.getState();
            notificationsStore.notifyBookingCancelled(booking.shift.title, booking.shift.facilityName);
          }

        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to cancel booking',
          });
        }
      },

      // Filtering and search
      setFilters: (newFilters) => {
        set(state => {
          const updatedFilters = { ...state.filters, ...newFilters };
          const filteredShifts = state.availableShifts.filter(shift => {
            // Apply filters
            if (updatedFilters.licenseType.length > 0 &&
                !updatedFilters.licenseType.includes(shift.licenseType)) {
              return false;
            }

            if (updatedFilters.department.length > 0 &&
                !updatedFilters.department.includes(shift.department)) {
              return false;
            }

            if (updatedFilters.isUrgent !== null &&
                shift.isUrgent !== updatedFilters.isUrgent) {
              return false;
            }

            if (shift.distance && shift.distance > updatedFilters.distance) {
              return false;
            }

            return true;
          });

          return {
            filters: updatedFilters,
            filteredShifts,
          };
        });
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query });

        // Apply search filter
        const { availableShifts, filters } = get();
        const filteredShifts = availableShifts.filter(shift => {
          const matchesSearch = query === '' ||
            shift.title.toLowerCase().includes(query.toLowerCase()) ||
            shift.facilityName.toLowerCase().includes(query.toLowerCase()) ||
            shift.department.toLowerCase().includes(query.toLowerCase());

          if (!matchesSearch) return false;

          // Apply other filters
          if (filters.licenseType.length > 0 &&
              !filters.licenseType.includes(shift.licenseType)) {
            return false;
          }

          if (filters.department.length > 0 &&
              !filters.department.includes(shift.department)) {
            return false;
          }

          if (filters.isUrgent !== null &&
              shift.isUrgent !== filters.isUrgent) {
            return false;
          }

          if (shift.distance && shift.distance > filters.distance) {
            return false;
          }

          return true;
        });

        set({ filteredShifts });
      },

      clearFilters: () => {
        set({
          filters: {
            licenseType: [],
            distance: 50,
            dateRange: null,
            department: [],
            isUrgent: null,
          },
          searchQuery: '',
          filteredShifts: get().availableShifts,
        });
      },

      // State management
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'shifts-storage',
      storage: createJSONStorage(() => ({
        getItem: async (name: string) => {
          const value = await getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name: string, value: any) => {
          await setItem(name, JSON.stringify(value));
        },
        removeItem: async (name: string) => {
          // Not implemented for this store
        },
      })),
      partialize: (state) => ({
        userBookings: state.userBookings,
        filters: state.filters,
      }),
    }
  )
);