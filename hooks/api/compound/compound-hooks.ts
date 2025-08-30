import { useMobileDashboard } from "../dashboard/use-mobile-dashboard";
import { useUnreadNotifications } from "../notifications/use-unread-notifications";
import { useMyShifts } from "../shifts/use-my-shifts";
import { useMyAttendanceRecords } from "../attendance/use-my-attendance-records";
import { useMySwapRequests } from "../swaps/use-my-swap-requests";

/**
 * Hook that fetches all essential data for the mobile app home screen
 */
export const useMobileHomeData = (nurseId: number) => {
    const dashboard = useMobileDashboard(nurseId);
    const upcomingShifts = useMyShifts(nurseId, {
      start_date: new Date().toISOString().split('T')[0],
      limit: 5,
    });
    const unreadNotifications = useUnreadNotifications();
    const pendingSwaps = useMySwapRequests(nurseId);
  
    return {
      dashboard,
      upcomingShifts,
      unreadNotifications,
      pendingSwaps,
      isLoading: dashboard.isLoading || upcomingShifts.isLoading || unreadNotifications.isLoading || pendingSwaps.isLoading,
      error: dashboard.error || upcomingShifts.error || unreadNotifications.error || pendingSwaps.error,
    };
  };
  
  /**
   * Hook for getting current shift status and ability to clock in/out
   */
  export const useCurrentShiftStatus = (nurseId: number) => {
    const today = new Date().toISOString().split('T')[0];
    const todaysShifts = useMyShifts(nurseId, {
      start_date: today,
      end_date: today,
    });
    
    const todaysAttendance = useMyAttendanceRecords(nurseId, {
      start_date: today,
      end_date: today,
    });
  
    // Determine current shift status
    const currentShift = todaysShifts.data?.data.find(shift => {
      const now = new Date();
      const shiftStart = new Date(shift.start_time);
      const shiftEnd = new Date(shift.end_time);
      return now >= shiftStart && now <= shiftEnd;
    });
  
    const currentAttendance = todaysAttendance.data?.data.find(record => 
      record.assignment.shift_id === currentShift?.shift_id
    );
  
    const canClockIn = currentShift && !currentAttendance?.clock_in_time;
    const canClockOut = currentShift && currentAttendance?.clock_in_time && !currentAttendance?.clock_out_time;
    const isOnShift = !!currentShift && !!currentAttendance?.clock_in_time && !currentAttendance?.clock_out_time;
  
    return {
      currentShift,
      currentAttendance,
      canClockIn,
      canClockOut,
      isOnShift,
      isLoading: todaysShifts.isLoading || todaysAttendance.isLoading,
      error: todaysShifts.error || todaysAttendance.error,
    };
  };
  
  /**
   * Hook for getting this week's schedule summary
   */
  export const useWeeklySchedule = (nurseId: number, weekOffset: number = 0) => {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + (weekOffset * 7));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
  
    const weeklyShifts = useMyShifts(nurseId, {
      start_date: startOfWeek.toISOString().split('T')[0],
      end_date: endOfWeek.toISOString().split('T')[0],
      limit: 50,
    });
  
    const weeklyAttendance = useMyAttendanceRecords(nurseId, {
      start_date: startOfWeek.toISOString().split('T')[0],
      end_date: endOfWeek.toISOString().split('T')[0],
      limit: 50,
    });
  
    // Calculate weekly totals
    const totalHours = weeklyAttendance.data?.data.reduce((sum, record) => {
      if (record.clock_in_time && record.clock_out_time) {
        const start = new Date(record.clock_in_time);
        const end = new Date(record.clock_out_time);
        return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      }
      return sum;
    }, 0) || 0;
  
    const overtimeHours = weeklyAttendance.data?.data.reduce((sum, record) => {
      return sum + (record.overtime_minutes || 0) / 60;
    }, 0) || 0;
  
    return {
      shifts: weeklyShifts.data?.data || [],
      attendance: weeklyAttendance.data?.data || [],
      totalHours: Math.round(totalHours * 100) / 100,
      overtimeHours: Math.round(overtimeHours * 100) / 100,
      isLoading: weeklyShifts.isLoading || weeklyAttendance.isLoading,
      error: weeklyShifts.error || weeklyAttendance.error,
    };
  };