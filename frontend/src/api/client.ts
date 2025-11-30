/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const API_BASE_URL = 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This is crucial for cookies
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Use getState() to get the current token
    const token = useAuthStore.getState().token;
    
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      hasToken: !!token,
      withCredentials: config.withCredentials
    });
    
    // Add Bearer token if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Success: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      code: error.code
    });

    // Handle network errors
    if (error.code === 'ECONNABORTED' || !error.response) {
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        isNetworkError: true
      });
    }
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      console.log('🔄 401 detected, logging out...');
      const authStore = useAuthStore.getState();
      
      // Only logout if we were previously authenticated
      if (authStore.isAuthenticated) {
        authStore.logout();
      }
      
      return Promise.reject({
        message: 'Session expired. Please login again.',
        status: 401,
        isAuthError: true
      });
    }
    
    // Handle server errors
    if (error.response.status >= 500) {
      return Promise.reject({
        message: 'Server error. Please try again later.',
        isServerError: true,
        status: error.response.status
      });
    }
    
    // Use server error message or default message
    const errorMessage = error.response?.data?.message || 'An error occurred';
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data
    });
  }
);

// Health check function
export const checkServerHealth = async (): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await apiClient.get('/health');
    return { success: true, message: response.data.message };
  } catch (error: any) {
    console.error('❌ Server health check failed:', error);
    return { 
      success: false, 
      message: error.message || 'Cannot connect to server' 
    };
  }
};