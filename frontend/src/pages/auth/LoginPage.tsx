import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaHome, FaEnvelope, FaLock } from 'react-icons/fa';
import { useAuth, useToast } from '@/hooks';
import { Button, Input, Card } from '@/components/common';
import { loginSchema, LoginFormData } from './schemas';
import type { ApiError } from '@/types';

/**
 * LoginPage component
 */
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  /**
   * Handle form submission
   */
  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);

      // Call login from AuthContext
      await login(data);

      // Show success message
      toast.success('Login successful!');

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      const apiError = error as ApiError;

      // Show error message
      toast.error(apiError.message || 'Login failed');

      // Show validation errors if present
      if (apiError.errors) {
        Object.entries(apiError.errors).forEach(([field, messages]) => {
          messages.forEach((message) => {
            toast.error(`${field}: ${message}`);
          });
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md" padding={false}>
        {/* Header */}
        <div className="px-8 pt-8 pb-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FaHome className="text-3xl text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-8 pb-8">
          <div className="space-y-4">
            {/* Email */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="Email address"
                  error={errors.email?.message}
                  className="pl-10"
                  fullWidth
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <Input
                  {...register('password')}
                  type="password"
                  placeholder="Password"
                  error={errors.password?.message}
                  className="pl-10"
                  fullWidth
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>

        {/* Demo Credentials */}
        <div className="px-8 pb-8 pt-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <p className="text-xs text-gray-600 mb-2 font-medium">
            Demo Credentials:
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>Email: egalvan@example.com</p>
            <p>Password: password</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;