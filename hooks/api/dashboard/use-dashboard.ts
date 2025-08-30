import { useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNurseProfile } from "@/hooks/api/profile/use-nurse-profile";
import { useTodayShift } from "@/hooks/api/shifts/use-today-shift";
import { useMyShifts } from "@/hooks/api/shifts/use-my-shifts";
import { useNotifications } from "@/hooks/api/notifications/use-notifications";
import { useUnreadNotifications } from "@/hooks/api/notifications/use-unread-notifications";
import { mobileQueryKeys } from "../query-keys";

export interface UseDashboardResult {
  todayShift: any | null;
  todayShifts: any[];
  upcomingShifts: any[];
  urgentNotifications: any[];
  nurseProfile: any | null;
  loading: boolean;
  refresh: () => void;
}

export const useDashboard = (nurseId: number | null | undefined): UseDashboardResult => {
  const id = nurseId ?? 0;
  const queryClient = useQueryClient();

  const { data: nurseResponse, isLoading: loadingProfile } = useNurseProfile(id, {
    enabled: !!nurseId,
  });

  const { data: todayShift } = useTodayShift(id);

  const { data: upcomingShiftsResp, isLoading: loadingUpcoming } = useMyShifts(id, {
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    limit: 10,
  });

  const { data: urgentResp, isLoading: loadingUrgent } = useNotifications(
    { unread_only: true, limit: 10, priority: "urgent" },
    {
      // keep stale settings but preserve queryKey provided inside hook
      staleTime: 30_000,
    } as any
  );

  const { data: unreadResp } = useUnreadNotifications();

  const refresh = useCallback(() => {
    if (!nurseId) return;
    // Profile
    queryClient.invalidateQueries({ queryKey: mobileQueryKeys.nurse(id) });
    // Today's shift
    queryClient.invalidateQueries({ queryKey: mobileQueryKeys.todayShift(id) });
    // Any shifts-related queries (covers myShifts with filters)
    queryClient.invalidateQueries({ queryKey: mobileQueryKeys.shifts });
    // Notifications
    queryClient.invalidateQueries({ queryKey: mobileQueryKeys.notifications });
    // Dashboard metrics
    queryClient.invalidateQueries({ queryKey: mobileQueryKeys.dashboard });
  }, [id, nurseId, queryClient]);

  const result = useMemo<UseDashboardResult>(() => {
    const todayAssignments = todayShift?.assignments ?? [];
    return {
      todayShift: todayShift ?? null,
      todayShifts: todayAssignments,
      upcomingShifts: upcomingShiftsResp?.data ?? [],
      urgentNotifications: urgentResp?.data ?? unreadResp?.data ?? [],
      nurseProfile: nurseResponse?.data ?? null,
      loading: loadingProfile || loadingUpcoming || loadingUrgent,
      refresh,
    };
  }, [
    todayShift,
    upcomingShiftsResp,
    urgentResp,
    unreadResp,
    nurseResponse,
    loadingProfile,
    loadingUpcoming,
    loadingUrgent,
    refresh,
  ]);

  return result;
};


