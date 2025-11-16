import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPasswordSchema, type ForgotPasswordInput } from '../../schemas/zodSchemas';
import { useForgotPassword } from '../../api/hooks';
import { Mail, CheckCircle2 } from 'lucide-react';

export const Forgot: React.FC = () => {
  const navigate = useNavigate();
  const forgotPasswordMutation = useForgotPassword();
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      await forgotPasswordMutation.mutateAsync({ email: data.email });
      setIsSubmitted(true);
      // Auto-redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login?message=Password reset link sent to your email.');
      }, 3000);
    } catch (error: any) {
      console.error('Forgot password failed:', error);
    }
  };

  // Success Message with auto-redirect
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="max-w-md w-full bg-white shadow-xl rounded-xl p-8 space-y-6 text-center">
          
          <div className="flex justify-center">
            <div className="bg-green-600 p-3 rounded-full shadow">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900">
            Check your email
          </h2>

          <p className="text-gray-600 text-sm">
            We've sent a password reset link to your email address.
          </p>

          <p className="text-gray-500 text-sm">
            Redirecting to login in 3 seconds...
          </p>

          <Link
            to="/login"
            className="inline-block text-indigo-600 hover:text-indigo-500 font-medium mt-4"
          >
            Go to Login Now
          </Link>
        </div>
      </div>
    );
  }

  // Forgot Password Form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-xl p-8 space-y-8">

        {/* Icon */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-600 p-3 rounded-full shadow-md">
              <Mail className="h-8 w-8 text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900">
            Reset your password
          </h2>

          <p className="text-gray-600 text-sm mt-2">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              {...register('email')}
              type="email"
              placeholder="Enter your email"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
              focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={forgotPasswordMutation.isLoading}
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium 
            rounded-lg shadow transition disabled:opacity-50"
          >
            {forgotPasswordMutation.isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <p className="text-center text-sm">
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Back to login
            </Link>
          </p>
        </form>

      </div>
    </div>
  );
};