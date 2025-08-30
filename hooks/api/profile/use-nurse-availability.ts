import { nurseApi } from "@/services/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { mobileQueryKeys } from "../query-keys";
import { ApiResponse, NurseAvailability, ApiError } from "@/types/api";

export const useNurseAvailability = (
    nurseId: number,
    startDate?: string,
    endDate?: string,
    options?: UseQueryOptions<ApiResponse<NurseAvailability[]>, ApiError>
  ) => {
    return useQuery({
      queryKey: mobileQueryKeys.availability(nurseId),
      queryFn: () => nurseApi.getAvailability(nurseId, startDate, endDate),
      enabled: !!nurseId,
      ...options,
    });
  };