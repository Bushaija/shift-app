import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { nurseApi } from '@/services/api';
import { mobileQueryKeys } from '../query-keys';
import { ApiError, PaginatedResponse, Nurse } from '@/types/api';

// We might need filters later, e.g., by department or skill
export interface NurseFilters {
  page?: number;
  limit?: number;
  department_id?: number;
}

export interface UseNursesOptions {
  filters?: NurseFilters;
  enabled?: boolean;
}

export const useNurses = (options: UseNursesOptions = {}) => {
  const { filters, enabled = true } = options;

  return useQuery<PaginatedResponse<Nurse>, ApiError>({
    queryKey: mobileQueryKeys.nurses.list(filters),
    queryFn: () => nurseApi.nurses.getNurses(filters),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
