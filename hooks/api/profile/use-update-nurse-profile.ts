import { nurseApi } from "@/services/api";
import { mobileQueryKeys } from "../query-keys";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { ApiError, ApiResponse, Nurse, UpdateNurseProfileRequest } from "@/types/api";

export const useUpdateNurseProfile = (
    nurseId: number,
    options?: UseMutationOptions<ApiResponse<Nurse>, ApiError, UpdateNurseProfileRequest>
  ) => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: (data) => nurseApi.updateNurse(nurseId, data),
      onSuccess: (updatedNurse) => {
        queryClient.setQueryData(mobileQueryKeys.nurse(nurseId), updatedNurse);
      },
      ...options,
    });
  };    