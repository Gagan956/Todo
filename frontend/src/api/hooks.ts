/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import { useAuthStore } from '../store/useAuthStore';
import type { 
  LoginInput, 
  SignupInput, 
  ResetPasswordInput,
  TodoInput 
} from '../schemas/zodSchemas';

// Auth mutations
export const useLogin = () => {
  const { login, setLoading, setError } = useAuthStore();
  
  return useMutation({
    mutationFn: async (credentials: LoginInput) => {
      setLoading(true);
      const { data } = await apiClient.post('/auth/login', credentials);
      return data;
    },
    onSuccess: (data) => {
      login(data.user, data.token);
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Login failed');
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

export const useSignup = () => {
  const { login, setLoading, setError } = useAuthStore();
  
  return useMutation({
    mutationFn: async (userData: SignupInput) => {
      setLoading(true);
      const { data } = await apiClient.post('/auth/signup', userData);
      return data;
    },
    onSuccess: (data) => {
      login(data.user, data.token);
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Signup failed');
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post('/auth/logout');
      return data;
    },
    onSuccess: () => {
      queryClient.clear();
      logout(true);
    },
    onError: () => {
      queryClient.clear();
      logout(true);
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await apiClient.post('/auth/forgot-password', data);
      return response.data;
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (data: ResetPasswordInput & { resetToken: string }) => {
      const response = await apiClient.post('/auth/reset-password', data);
      return response.data;
    },
  });
};

export const useGetCurrentUser = () => {
  const { isAuthenticated, token } = useAuthStore();
  
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data } = await apiClient.get('/auth/me');
      return data;
    },
    enabled: isAuthenticated && !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 3;
    },
  });
};

export const useUpdateProfile = () => {
  const { updateUser } = useAuthStore();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData: { name?: string; email?: string }) => {
      const { data } = await apiClient.put('/auth/profile', userData);
      return data;
    },
    onSuccess: (data) => {
      updateUser(data.user);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (passwordData: { 
      currentPassword: string; 
      newPassword: string; 
    }) => {
      const { data } = await apiClient.put('/auth/change-password', passwordData);
      return data;
    },
  });
};

// Todo queries and mutations
export const useTodos = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['todos', page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get(`/todos?page=${page}&limit=${limit}`);
      return data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });
};

export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (todoData: TodoInput) => {
      const { data } = await apiClient.post('/todos', todoData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError: (error: any) => {
      console.error('Create todo error:', error);
    },
  });
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<TodoInput>) => {
      const response = await apiClient.put(`/todos/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/todos/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};

export const useToggleTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch(`/todos/${id}/toggle`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};

// Server health check
export const useServerHealth = () => {
  return useQuery({
    queryKey: ['serverHealth'],
    queryFn: async () => {
      const response = await apiClient.get('/health');
      return response.data;
    },
    refetchInterval: 30000, // Check every 30 seconds
    retry: 3,
  });
};