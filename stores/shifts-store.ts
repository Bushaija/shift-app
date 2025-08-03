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
          // TODO: Replace with actual API call
          // const shifts = await shiftsApi.getAvailableShifts();

          // Mock data for now
          const mockShifts: Shift[] = [
            {
              id: '1',
              facilityId: '1',
              facilityName: 'King Faisal Hospital',
              title: 'RN - Emergency Department',
              description: 'Emergency department nursing position requiring critical care experience.',
              department: 'Emergency',
              licenseType: 'RN',
              shiftDate: '2024-01-15',
              startTime: '19:00',
              endTime: '03:00',
              hourlyRate: 18000,
              totalHours: 8,
              isUrgent: true,
              status: 'open',
              createdAt: new Date().toISOString(),
              distance: 2.5,
              location: 'Gasabo District',
            },
            {
              id: '2',
              facilityId: '2',
              facilityName: 'La Croix du Sud Hospital',
              title: 'LPN - ICU',
              description: 'Intensive care unit position for experienced LPN.',
              department: 'ICU',
              licenseType: 'LPN',
              shiftDate: '2024-01-16',
              startTime: '06:00',
              endTime: '18:00',
              hourlyRate: 25000,
              totalHours: 12,
              isUrgent: false,
              status: 'open',
              createdAt: new Date().toISOString(),
              distance: 5.2,
              location: 'Gasabo District',
            },
            {
              id: '3',
              facilityId: '3',
              facilityName: 'Kibagabaga Hospital',
              title: 'CNA - Medical Surgical',
              description: 'Medical surgical unit position for certified nursing assistant.',
              department: 'Medical Surgical',
              licenseType: 'CNA',
              shiftDate: '2024-01-19',
              startTime: '15:00',
              endTime: '23:00',
              hourlyRate: 12000,
              totalHours: 8,
              isUrgent: false,
              status: 'open',
              createdAt: new Date().toISOString(),
              distance: 8.1,
              location: 'Gasabo District',
            },
          ];

          set({
            availableShifts: mockShifts,
            filteredShifts: mockShifts,
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
          // TODO: Replace with actual API call
          // const bookings = await shiftsApi.getUserBookings();

          // Mock data for now
          const mockBookings: Booking[] = [
            {
              id: '1',
              userId: '1',
              shiftId: '1',
              status: 'confirmed',
              bookedAt: new Date().toISOString(),
              confirmedAt: new Date().toISOString(),
              shift: {
                id: '1',
                facilityId: '1',
                facilityName: 'City General Hospital',
                title: 'RN - Emergency Department',
                department: 'Emergency',
                licenseType: 'RN',
                shiftDate: '2024-01-15',
                startTime: '19:00',
                endTime: '03:00',
                hourlyRate: 45,
                totalHours: 8,
                isUrgent: true,
                status: 'open',
                createdAt: new Date().toISOString(),
              },
            },
            {
              id: '2',
              userId: '1',
              shiftId: '2',
              status: 'pending',
              bookedAt: new Date().toISOString(),
              shift: {
                id: '2',
                facilityId: '2',
                facilityName: 'Memorial Medical Center',
                title: 'LPN - ICU',
                department: 'ICU',
                licenseType: 'LPN',
                shiftDate: '2024-01-16',
                startTime: '06:00',
                endTime: '18:00',
                hourlyRate: 38,
                totalHours: 12,
                isUrgent: false,
                status: 'open',
                createdAt: new Date().toISOString(),
              },
            },
          ];

          set({
            userBookings: mockBookings,
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
