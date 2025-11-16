import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/useAuthStore';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Auth/Login';
import { Signup } from './pages/Auth/Signup';
import { Forgot } from './pages/Auth/Forgot';
import { Reset } from './pages/Auth/Reset';
import { TodosPage } from './pages/Todos/TodosPage';
import { useEffect, useState } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  const { isAuthenticated, initialize } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state on app start
  useEffect(() => {
    const initAuth = async () => {
      await initialize();
      setIsInitialized(true);
    };
    initAuth();
  }, [initialize]);

  // Show loading while initializing auth state
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public routes - redirect to todos if already authenticated */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
                <Navigate to="/todos" replace /> : 
                <Login />
            } 
          />
          <Route 
            path="/signup" 
            element={
              isAuthenticated ? 
                <Navigate to="/todos" replace /> : 
                <Signup />
            } 
          />
          <Route 
            path="/forgot-password" 
            element={
              isAuthenticated ? 
                <Navigate to="/todos" replace /> : 
                <Forgot />
            } 
          />
          <Route 
            path="/reset-password/:token?" 
            element={
              isAuthenticated ? 
                <Navigate to="/todos" replace /> : 
                <Reset />
            } 
          />
          
          {/* Protected routes */}
          <Route 
            path="/todos" 
            element={
              <ProtectedRoute>
                <Layout>
                  <TodosPage />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          {/* Default routes */}
          <Route 
            path="/" 
            element={
              <Navigate to={isAuthenticated ? "/todos" : "/login"} replace />
            } 
          />
          
          {/* 404 fallback */}
          <Route 
            path="*" 
            element={
              <Navigate to={isAuthenticated ? "/todos" : "/login"} replace />
            } 
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;