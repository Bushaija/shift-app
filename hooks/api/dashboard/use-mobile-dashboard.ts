import { ApiError, ApiResponse } from "@/types/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { mobileQueryKeys } from "../query-keys";
import { nurseApi } from "@/services/api";
import { MobileDashboardMetrics } from "@/types/api";

export const useMobileDashboard = (
    nurseId: number,
    options?: UseQueryOptions<ApiResponse<MobileDashboardMetrics>, ApiError>
  ) => {
    return useQuery({
      queryKey: mobileQueryKeys.dashboardMetrics(nurseId),
      queryFn: () => nurseApi.dashboard.getMobileDashboard(nurseId),
      enabled: !!nurseId,
      refetchInterval: 5 * 60 * 1000,
      ...options,
    });
  };