import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getItem, setItem } from '@/lib/storage';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'booking_confirmed' | 'booking_pending' | 'booking_cancelled' | 'payment_received' | 'general';
  isRead: boolean;
  createdAt: string;
  data?: any;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
}

interface NotificationsActions {
  // Notification management
  addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearAll: () => void;

  // Booking notifications
  notifyBookingConfirmed: (shiftTitle: string, facilityName: string) => void;
  notifyBookingPending: (shiftTitle: string, facilityName: string) => void;
  notifyBookingCancelled: (shiftTitle: string, facilityName: string) => void;
  notifyPaymentReceived: (amount: number) => void;
}

export const useNotificationsStore = create<NotificationsState & NotificationsActions>()(
  persist(
    (set, get) => ({
      // Initial state
      notifications: [],
      unreadCount: 0,

      // Notification management
      addNotification: (notificationData) => {
        const notification: Notification = {
          id: Date.now().toString(),
          isRead: false,
          createdAt: new Date().toISOString(),
          ...notificationData,
        };

        set(state => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
      },

      markAsRead: (notificationId) => {
        set(state => ({
          notifications: state.notifications.map(notification =>
            notification.id === notificationId
              ? { ...notification, isRead: true }
              : notification
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      },

      markAllAsRead: () => {
        set(state => ({
          notifications: state.notifications.map(notification => ({
            ...notification,
            isRead: true,
          })),
          unreadCount: 0,
        }));
      },

      removeNotification: (notificationId) => {
        set(state => {
          const notification = state.notifications.find(n => n.id === notificationId);
          return {
            notifications: state.notifications.filter(n => n.id !== notificationId),
            unreadCount: notification?.isRead ? state.unreadCount : Math.max(0, state.unreadCount - 1),
          };
        });
      },

      clearAll: () => {
        set({
          notifications: [],
          unreadCount: 0,
        });
      },

      // Booking notifications
      notifyBookingConfirmed: (shiftTitle, facilityName) => {
        get().addNotification({
          title: 'Booking Confirmed! 🎉',
          message: `Your application for ${shiftTitle} at ${facilityName} has been confirmed.`,
          type: 'booking_confirmed',
          data: { shiftTitle, facilityName },
        });
      },

      notifyBookingPending: (shiftTitle, facilityName) => {
        get().addNotification({
          title: 'Application Submitted',
          message: `Your application for ${shiftTitle} at ${facilityName} has been submitted and is under review.`,
          type: 'booking_pending',
          data: { shiftTitle, facilityName },
        });
      },

      notifyBookingCancelled: (shiftTitle, facilityName) => {
        get().addNotification({
          title: 'Booking Cancelled',
          message: `Your booking for ${shiftTitle} at ${facilityName} has been cancelled.`,
          type: 'booking_cancelled',
          data: { shiftTitle, facilityName },
        });
      },

      notifyPaymentReceived: (amount) => {
        get().addNotification({
          title: 'Payment Received 💰',
          message: `You've received a payment of $${amount.toLocaleString()} for your completed shifts.`,
          type: 'payment_received',
          data: { amount },
        });
      },
    }),
    {
      name: 'notifications-storage',
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
        notifications: state.notifications,
        unreadCount: state.unreadCount,
      }),
    }
  )
);
