import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
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
  logout: (redirectToLogin?: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: (user: User, token: string) => {
        set({ 
          user, 
          token,
          isAuthenticated: true, 
          error: null,
          isLoading: false 
        });
        console.log('✅ User logged in:', user.email);
      },

      logout: (redirectToLogin = true) => {
        console.log('🔄 Logging out user...');
        
        set({ 
          user: null, 
          token: null,
          isAuthenticated: false, 
          error: null,
          isLoading: false 
        });
        
        // Clear persisted data
        localStorage.removeItem('auth-storage');
        sessionStorage.clear();
        
        console.log('✅ User logged out from store');
        
        // Redirect to login if needed
        if (redirectToLogin && typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error, isLoading: false });
      },

      clearError: () => {
        set({ error: null });
      },

      updateUser: (updatedUser: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ 
            user: { ...user, ...updatedUser } 
          });
          console.log('✅ User profile updated');
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