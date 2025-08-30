import { 
    useQuery, 
    useMutation, 
    useQueryClient,
    UseQueryOptions,
    UseMutationOptions,
  } from '@tanstack/react-query';
  import { userApi } from '../services/api';
  import { User, CreateUserRequest, UpdateUserRequest, UserFilters, UsersListResponse, ApiError } from '../types/api';
  
  // Query keys with proper typing
  export const userKeys = {
    all: ['users'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
    list: (filters?: UserFilters) => [...userKeys.lists(), { filters }] as const,
    details: () => [...userKeys.all, 'detail'] as const,
    detail: (id: number) => [...userKeys.details(), id] as const,
  };
  
  // Get all users hook
  export const useUsers = (
    filters?: UserFilters,
    options?: UseQueryOptions<UsersListResponse, ApiError>
  ) => {
    return useQuery({
      queryKey: userKeys.list(filters),
      queryFn: () => userApi.getUsers(filters),
      ...options,
    });
  };
  
  // Get single user hook
  export const useUser = (
    id: number,
    options?: UseQueryOptions<User, ApiError>
  ) => {
    return useQuery({
      queryKey: userKeys.detail(id),
      queryFn: () => userApi.getUser(id),
      enabled: !!id,
      ...options,
    });
  };
  
  // Create user mutation hook
  export const useCreateUser = (
    options?: UseMutationOptions<User, ApiError, CreateUserRequest>
  ) => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: userApi.createUser,
      onSuccess: (newUser) => {
        // Invalidate and refetch users list
        queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        
        // Optimistically add the new user to existing queries
        queryClient.setQueriesData<UsersListResponse>(
          { queryKey: userKeys.lists() },
          (old) => {
            if (!old) return old;
            return {
              ...old,
              users: [newUser, ...old.users],
              total: old.total + 1,
            };
          }
        );
      },
      ...options,
    });
  };
  
  // Update user mutation hook
  interface UpdateUserVariables {
    id: number;
    userData: UpdateUserRequest;
  }
  
  export const useUpdateUser = (
    options?: UseMutationOptions<User, ApiError, UpdateUserVariables>
  ) => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: ({ id, userData }) => userApi.updateUser(id, userData),
      onSuccess: (updatedUser, variables) => {
        // Update the specific user in cache
        queryClient.setQueryData(userKeys.detail(variables.id), updatedUser);
        
        // Update user in lists
        queryClient.setQueriesData<UsersListResponse>(
          { queryKey: userKeys.lists() },
          (old) => {
            if (!old) return old;
            return {
              ...old,
              users: old.users.map(user => 
                user.id === variables.id ? updatedUser : user
              ),
            };
          }
        );
      },
      ...options,
    });
  };
  
  // Delete user mutation hook
  export const useDeleteUser = (
    options?: UseMutationOptions<void, ApiError, number>
  ) => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: userApi.deleteUser,
      onSuccess: (_, deletedId) => {
        // Remove user from cache
        queryClient.removeQueries({ queryKey: userKeys.detail(deletedId) });
        
        // Remove from lists
        queryClient.setQueriesData<UsersListResponse>(
          { queryKey: userKeys.lists() },
          (old) => {
            if (!old) return old;
            return {
              ...old,
              users: old.users.filter(user => user.id !== deletedId),
              total: old.total - 1,
            };
          }
        );
      },
      ...options,
    });
  };