import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { loginSchema, type LoginInput } from '../../schemas/zodSchemas';
import { useLogin } from '../../api/hooks';
import { useAuthStore } from '../../store/useAuthStore';
import { AlertCircle, CheckCircle2, LogIn, Eye, EyeOff } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, isLoading: authLoading, error: authError } = useAuthStore();
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const redirectTo = searchParams.get('redirect') || '/todos';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  // Handle auth errors
  useEffect(() => {
    if (authError) {
      setError('root', { message: authError });
    }
  }, [authError, setError]);

  // Handle mutation errors
  useEffect(() => {
    if (loginMutation.isError) {
      setError('root', { 
        message: loginMutation.error?.message || 'Login failed. Please check your credentials.' 
      });
    }
  }, [loginMutation.isError, loginMutation.error, setError]);

  const onSubmit = async (data: LoginInput) => {
    try {
      await loginMutation.mutateAsync(data);
    } catch (error) {
      // Error is handled by the useEffect above
      console.error('Login error:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Use isPending for React Query v4+
  const isLoading = authLoading || loginMutation.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-xl p-8 space-y-8">
        
        {/* Icon + Title */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-600 p-3 rounded-full shadow-md">
              <LogIn className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome Back
          </h2>
          <p className="text-gray-600 mt-2">
            Sign in to continue to your dashboard
          </p>
        </div>

        {/* Root Error */}
        {errors.root && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-sm text-red-700">{errors.root.message}</span>
            </div>
          </div>
        )}

        {/* Success message (from redirect) */}
        {searchParams.get('message') && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-700">{searchParams.get('message')}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="Enter your email"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
              )}
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-between text-sm">
            <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-500">
              Forgot your password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow transition disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-b-transparent rounded-full"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        {/* Signup Link */}
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-600 hover:text-indigo-500 font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};