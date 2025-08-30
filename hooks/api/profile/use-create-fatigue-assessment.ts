import { ApiError, ApiResponse, CreateFatigueAssessmentRequest, FatigueAssessment } from "@/types/api";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { mobileQueryKeys } from "../query-keys";
import { nurseApi } from "@/services/api";

export const useCreateFatigueAssessment = (
    nurseId: number,
    options?: UseMutationOptions<ApiResponse<FatigueAssessment>, ApiError, CreateFatigueAssessmentRequest>
  ) => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: (data) => nurseApi.createFatigueAssessment(nurseId, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: mobileQueryKeys.fatigue(nurseId) });
        queryClient.invalidateQueries({ queryKey: mobileQueryKeys.nurse(nurseId) });
      },
      ...options,
    });
  };