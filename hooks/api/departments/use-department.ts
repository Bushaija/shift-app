import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '@/services/api/client';
import { mobileQueryKeys } from '../query-keys';

export interface DepartmentApiResponse {
  success: boolean;
  data: {
    deptId: number;
    deptName: string;
    minNursesPerShift: number;
    maxNursesPerShift: number;
    requiredSkills: number[];
    patientCapacity: number;
    acuityMultiplier: string;
    shiftOverlapMinutes: number;
    createdAt: string;
  };
  timestamp: string;
}

export function useDepartment(
  departmentId?: number,
  options?: Omit<UseQueryOptions<DepartmentApiResponse, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: mobileQueryKeys.departments.detail(departmentId ?? 0),
    queryFn: () => apiClient.get<DepartmentApiResponse>(`/departments/${departmentId}`, false),
    enabled: !!departmentId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}


