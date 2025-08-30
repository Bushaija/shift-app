import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { mobileQueryKeys } from "../query-keys";
import { ApiError, ApiResponse, UpdateAvailabilityRequest } from "@/types/api";
import { nurseApi } from "@/services/api";

export const useUpdateAvailability = (
    nurseId: number,
    options?: UseMutationOptions<ApiResponse<{ message: string }>, ApiError, UpdateAvailabilityRequest>
  ) => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: (data) => nurseApi.updateAvailability(nurseId, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: mobileQueryKeys.availability(nurseId) });
      },
      ...options,
    });
  };