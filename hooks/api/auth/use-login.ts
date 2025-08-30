import nurseApi from "@/services/api";
import { ApiError, ApiResponse, LoginRequest, LoginResponse } from "@/types/api";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export const useLogin = (
    options?: UseMutationOptions<ApiResponse<LoginResponse>, ApiError, LoginRequest>
  ) => {
    return useMutation({
      mutationFn: nurseApi.auth.login,
      ...options,
    });
  };
  
