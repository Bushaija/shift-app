import { nurseApi } from "@/services/api";
import { mobileQueryKeys } from "../query-keys";
import { ApiResponse } from "@/types/api";
import { UseQueryOptions } from "@tanstack/react-query";
import { FatigueAssessment } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { ApiError } from "@/types/api";

export const useFatigueHistory = (
    nurseId: number,
    days: number = 30,
    options?: UseQueryOptions<ApiResponse<FatigueAssessment[]>, ApiError>
  ) => {
    return useQuery({
      queryKey: mobileQueryKeys.fatigue(nurseId, days),
      queryFn: () => nurseApi.getFatigueHistory(nurseId, days),
      enabled: !!nurseId,
      ...options,
    });
  };