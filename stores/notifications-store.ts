import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getItem, setItem } from '@/lib/storage';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'urgent' | 'swap_approved' | 'schedule_updated' | 'break_reminder' | 'booking_confirmed' | 'booking_pending' | 'booking_cancelled' | 'payment_received' | 'general';
  priority: 'high' | 'medium' | 'low';
  isRead: boolean;
  createdAt: string;
  expiresAt?: string;
  data?: any;
  actionRequired?: boolean;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  urgentCount: number;
}

interface NotificationsActions {
  // Notification management
  addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearAll: () => void;
  clearExpired: () => void;

  // Specific notification types from wireframe
  notifyUrgentOvertime: (department: string, time: string) => void;
  notifySwapApproved: (shiftDate: string, partnerName: string) => void;
  notifyScheduleUpdated: () => void;
  notifyBreakReminder: (duration: string) => void;

  // Existing booking notifications
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
      urgentCount: 0,

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
          urgentCount: state.urgentCount + (notification.priority === 'high' ? 1 : 0),
        }));
      },

      markAsRead: (notificationId) => {
        set(state => {
          const notification = state.notifications.find(n => n.id === notificationId);
          const wasUrgent = notification?.priority === 'high' && !notification.isRead;

          return {
            notifications: state.notifications.map(n =>
              n.id === notificationId
                ? { ...n, isRead: true }
                : n
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
            urgentCount: wasUrgent ? Math.max(0, state.urgentCount - 1) : state.urgentCount,
          };
        });
      },

      markAllAsRead: () => {
        set(state => ({
          notifications: state.notifications.map(notification => ({
            ...notification,
            isRead: true,
          })),
          unreadCount: 0,
          urgentCount: 0,
        }));
      },

      removeNotification: (notificationId) => {
        set(state => {
          const notification = state.notifications.find(n => n.id === notificationId);
          const wasUrgent = notification?.priority === 'high' && !notification.isRead;

          return {
            notifications: state.notifications.filter(n => n.id !== notificationId),
            unreadCount: notification?.isRead ? state.unreadCount : Math.max(0, state.unreadCount - 1),
            urgentCount: wasUrgent ? Math.max(0, state.urgentCount - 1) : state.urgentCount,
          };
        });
      },

      clearAll: () => {
        set({
          notifications: [],
          unreadCount: 0,
          urgentCount: 0,
        });
      },

      clearExpired: () => {
        const now = new Date();
        set(state => {
          const validNotifications = state.notifications.filter(n => {
            if (!n.expiresAt) return true;
            return new Date(n.expiresAt) > now;
          });

          const urgentCount = validNotifications.filter(n => n.priority === 'high' && !n.isRead).length;
          const unreadCount = validNotifications.filter(n => !n.isRead).length;

          return {
            notifications: validNotifications,
            unreadCount,
            urgentCount,
          };
        });
      },

      // Wireframe notification types
      notifyUrgentOvertime: (department: string, time: string) => {
        get().addNotification({
          title: 'URGENT: Mandatory Overtime',
          message: `Report to ${department} by ${time}`,
          type: 'urgent',
          priority: 'high',
          actionRequired: true,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
          data: { department, time },
        });
      },

      notifySwapApproved: (shiftDate: string, partnerName: string) => {
        get().addNotification({
          title: 'Swap Approved',
          message: `Your ${shiftDate} shift swap with ${partnerName} has been approved.`,
          type: 'swap_approved',
          priority: 'medium',
          actionRequired: false,
          data: { shiftDate, partnerName },
        });
      },

      notifyScheduleUpdated: () => {
        get().addNotification({
          title: 'Schedule Updated',
          message: "Next week's schedule is now available.",
          type: 'schedule_updated',
          priority: 'medium',
          actionRequired: false,
          data: { scheduleType: 'weekly' },
        });
      },

      notifyBreakReminder: (duration: string) => {
        get().addNotification({
          title: 'Break Reminder',
          message: `You're due for a ${duration} break.`,
          type: 'break_reminder',
          priority: 'low',
          actionRequired: true,
          expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
          data: { duration },
        });
      },

      // Existing booking notifications
      notifyBookingConfirmed: (shiftTitle: string, facilityName: string) => {
        get().addNotification({
          title: 'Booking Confirmed! 🎉',
          message: `Your application for ${shiftTitle} at ${facilityName} has been confirmed.`,
          type: 'booking_confirmed',
          priority: 'medium',
          actionRequired: false,
          data: { shiftTitle, facilityName },
        });
      },

      notifyBookingPending: (shiftTitle: string, facilityName: string) => {
        get().addNotification({
          title: 'Application Submitted',
          message: `Your application for ${shiftTitle} at ${facilityName} has been submitted and is under review.`,
          type: 'booking_pending',
          priority: 'low',
          actionRequired: false,
          data: { shiftTitle, facilityName },
        });
      },

      notifyBookingCancelled: (shiftTitle: string, facilityName: string) => {
        get().addNotification({
          title: 'Booking Cancelled',
          message: `Your booking for ${shiftTitle} at ${facilityName} has been cancelled.`,
          type: 'booking_cancelled',
          priority: 'high',
          actionRequired: false,
          data: { shiftTitle, facilityName },
        });
      },

      notifyPaymentReceived: (amount: number) => {
        get().addNotification({
          title: 'Payment Received 💰',
          message: `You've received a payment of $${amount.toLocaleString()} for your completed shifts.`,
          type: 'payment_received',
          priority: 'medium',
          actionRequired: false,
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
        urgentCount: state.urgentCount,
      }),
    }
  )
);
