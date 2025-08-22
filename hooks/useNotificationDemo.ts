import { useEffect } from 'react';
import { useNotificationsStore } from '@/stores/notifications-store';

export function useNotificationDemo() {
  const {
    notifications,
    notifyUrgentOvertime,
    notifySwapApproved,
    notifyScheduleUpdated,
    notifyBreakReminder,
    notifyBookingConfirmed,
    notifyPaymentReceived
  } = useNotificationsStore();

  useEffect(() => {
    // Only add demo notifications if there are none
    if (notifications.length === 0) {
      // Add sample notifications with delays to simulate real-time updates
      const timer1 = setTimeout(() => {
        notifyUrgentOvertime('ICU', '6 PM today');
      }, 1000);

      const timer2 = setTimeout(() => {
        notifySwapApproved('March 22', 'Sarah M.');
      }, 2000);

      const timer3 = setTimeout(() => {
        notifyScheduleUpdated();
      }, 3000);

      const timer4 = setTimeout(() => {
        notifyBreakReminder('30-minute');
      }, 4000);

      const timer5 = setTimeout(() => {
        notifyBookingConfirmed('Emergency Night Shift', 'City General Hospital');
      }, 5000);

      const timer6 = setTimeout(() => {
        notifyPaymentReceived(1250);
      }, 6000);

      // Cleanup timers
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
        clearTimeout(timer5);
        clearTimeout(timer6);
      };
    }
  }, [notifications.length, notifyUrgentOvertime, notifySwapApproved, notifyScheduleUpdated, notifyBreakReminder, notifyBookingConfirmed, notifyPaymentReceived]);
}
