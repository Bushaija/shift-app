import { ApiError, Shift } from "@/types/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { mobileQueryKeys } from "../query-keys";
import { nurseApi } from "@/services/api";

export const useTodayShift = (
    nurseId: number,
    options?: UseQueryOptions<Shift, ApiError>
  ) => {
    return useQuery({
      queryKey: mobileQueryKeys.todayShift(nurseId),
      queryFn: async () => {
        const today = new Date().toISOString().split('T')[0];
        const response = await nurseApi.shifts.getShifts({ nurse_id: nurseId, start_date: today, limit: 1 });
        return response.data[0];
      },
      enabled: !!nurseId,
      ...options,
    });
  };
  
