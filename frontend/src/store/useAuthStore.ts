import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (user: User, token: string) => void;
  logout: (redirect?: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateUser: (user: Partial<User>) => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true, // Start as true
      error: null,

      login: (user: User, token: string) => {
        console.log('🔄 Storing token in localStorage:', token);
        localStorage.setItem('auth_token', token);
        set({
          user,
          token,
          isAuthenticated: true,
          error: null,
          isLoading: false,
        });
        console.log('✅ Login complete - isAuthenticated:', true);
      },

      logout: (redirect = false) => {
        console.log('🔄 Removing auth token');
        localStorage.removeItem('auth_token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
          isLoading: false,
        });
        
        if (redirect) {
          window.location.href = '/login';
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...userData },
          });
        }
      },

      initialize: () => {
        console.log('🔄 Initializing auth store...');
        const token = localStorage.getItem('auth_token');
        console.log('📝 Found token in localStorage:', token);
        
        if (token) {
          console.log('✅ Token found, setting authenticated');
          set({ 
            token, 
            isAuthenticated: true,
            isLoading: false 
          });
        } else {
          console.log('❌ No token found, setting not authenticated');
          set({ 
            isAuthenticated: false,
            isLoading: false 
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);