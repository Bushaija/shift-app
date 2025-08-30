import { nurseApi } from "@/services/api";
import { ApiError, ComplianceViolation, PaginatedResponse } from "@/types/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { mobileQueryKeys } from "../query-keys";

export const useMyComplianceViolations = (
    nurseId: number,
    options?: UseQueryOptions<PaginatedResponse<ComplianceViolation>, ApiError>
  ) => {
    return useQuery({
      queryKey: mobileQueryKeys.violations({ nurse_id: nurseId }),
      queryFn: () => nurseApi.compliance.getViolations({ nurse_id: nurseId }),
      enabled: !!nurseId,
      ...options,
    });
  };