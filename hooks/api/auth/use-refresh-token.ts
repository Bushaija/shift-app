import { nurseApi } from "@/services/api";
import { ApiError, RefreshTokenRequest, RefreshTokenResponse } from "@/types/api";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export const useRefreshToken = (
    options?: UseMutationOptions<RefreshTokenResponse, ApiError, RefreshTokenRequest>
  ) => {
    return useMutation({
      mutationFn: nurseApi.auth.refreshToken,
      ...options,
    });
  };