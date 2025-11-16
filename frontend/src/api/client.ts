import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const API_BASE_URL = import.meta.env.VITE_API_URL ||'https://todo-1-fx1k.onrender.com/api'


export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore.getState();
    
    // Add auth token to headers if available
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response; 
  },
  (error) => {
    const originalRequest = error.config;
    
    console.error('❌ Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      const authStore = useAuthStore.getState();
      authStore.logout();
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        isNetworkError: true
      });
    }
    
    // Handle server errors
    if (error.response.status >= 500) {
      return Promise.reject({
        message: 'Server error. Please try again later.',
        isServerError: true
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
export const checkServerHealth = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/health');
    return response.data.success === true;
  } catch (error) {
    console.error('❌ Server health check failed:', error);
    return false;
  }
};