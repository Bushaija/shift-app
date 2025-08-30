import { ApiError, ComplianceFilters, ComplianceViolation, PaginatedResponse } from "@/types/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { mobileQueryKeys } from "../query-keys";
import { nurseApi } from "@/services/api";

export const useComplianceViolations = (
    filters?: ComplianceFilters,
    options?: UseQueryOptions<PaginatedResponse<ComplianceViolation>, ApiError>
  ) => {
    return useQuery({
      queryKey: mobileQueryKeys.violations(filters),
      queryFn: () => nurseApi.compliance.getViolations(filters),
      ...options,
    });
  };