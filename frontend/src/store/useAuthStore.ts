// frontend: store/useAuthStore.ts
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
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      initializeAuth: () => {
        console.log('🔄 Auth store initialized');
        set({ isLoading: false });
      },

      login: (user: User, token: string) => {
        console.log('✅ User logging in:', user.email);
        set({ 
          user, 
          token,
          isAuthenticated: true, 
          error: null,
          isLoading: false 
        });
      },

      logout: (redirectToLogin = true) => {
        console.log('🚪 User logging out');
        
        set({ 
          user: null, 
          token: null,
          isAuthenticated: false, 
          error: null,
          isLoading: false 
        });
        
        // Clear storage
        localStorage.removeItem('auth-storage');
        
        if (redirectToLogin && typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
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
        }
      },
    }),
    {
      name: 'auth-storage',
      // ✅ CRITICAL: Persist ALL auth state including isAuthenticated
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated, // This was missing!
      }),
      onRehydrateStorage: () => (state) => {
        console.log('🔄 Store rehydration started');
        if (state) {
          // After rehydration, mark as not loading
          state.isLoading = false;
          console.log('✅ Store rehydration completed', { 
            user: !!state.user, 
            token: !!state.token,
            isAuthenticated: state.isAuthenticated 
          });
        }
      },
    }
  )
);