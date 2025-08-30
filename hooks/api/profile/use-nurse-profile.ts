import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { mobileQueryKeys } from "../query-keys";
import { ApiError, ApiResponse, Nurse } from "@/types/api";
import { nurseApi } from "@/services/api";

export const useNurseProfile = (
    nurseId: number,
    options?: Omit<UseQueryOptions<ApiResponse<Nurse>, ApiError>, 'queryKey' | 'queryFn'>
  ) => {
    return useQuery({
      queryKey: mobileQueryKeys.nurse(nurseId),
      queryFn: () => nurseApi.getNurse(nurseId),
      enabled: !!nurseId,
      ...options,
    });
  };