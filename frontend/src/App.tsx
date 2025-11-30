// frontend: App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Auth/Login';
import { Signup } from './pages/Auth/Signup';
import { Forgot } from './pages/Auth/Forgot';
import { Reset } from './pages/Auth/Reset';
import { TodosPage } from './pages/Todos/TodosPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppRoutes() {
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  console.log('🚀 App State:', { isAuthenticated, isLoading });

  // Show simple loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes - redirect to todos if already authenticated */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/todos" replace /> : <Login />} 
      />
      <Route 
        path="/signup" 
        element={isAuthenticated ? <Navigate to="/todos" replace /> : <Signup />} 
      />
      <Route 
        path="/forgot-password" 
        element={isAuthenticated ? <Navigate to="/todos" replace /> : <Forgot />} 
      />
      <Route 
        path="/reset-password" 
        element={isAuthenticated ? <Navigate to="/todos" replace /> : <Reset />} 
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
      
      {/* Default route */}
      <Route path="/" element={<Navigate to="/todos" replace />} />
      <Route path="*" element={<Navigate to="/todos" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppRoutes />
      </Router>
    </QueryClientProvider>
  );
}

export default App;