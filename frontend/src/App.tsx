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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
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
          
          <Route path="/" element={<Navigate to="/todos" replace />} />
          <Route path="*" element={<Navigate to="/todos" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;