// hooks/api/auth/use-nurses.ts
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { mobileQueryKeys } from "../query-keys";
import { ApiError, PaginatedResponse, Nurse } from "@/types/api";
import { apiClient } from "@/services/api/client";

// Simple API service for nurses using centralized client
const nursesApi = {
  getAllNurses: async (): Promise<PaginatedResponse<Nurse>> => {
    return apiClient.get<PaginatedResponse<Nurse>>('/nurses', false);
  }
};

export const useAllNurses = (
  options?: Omit<UseQueryOptions<PaginatedResponse<Nurse>, ApiError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: mobileQueryKeys.nurses,
    queryFn: nursesApi.getAllNurses,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes (v5: gcTime)
    retry: 2,
    ...options,
  });
};