import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaHome, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { useAuth, useToast } from '@/hooks';
import { Button, Input, Card } from '@/components/common';
import { registerSchema, RegisterFormData } from './schemas';
import type { ApiError } from '@/types';

/**
 * RegisterPage component
 */
export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  /**
   * Handle form submission
   */
  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);

      // Call register from AuthContext
      await registerUser(data);

      // Show success message
      toast.success('Registration successful!');

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      const apiError = error as ApiError;

      // Show error message
      toast.error(apiError.message || 'Registration failed');

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
            Create Account
          </h1>
          <p className="text-gray-600">
            Sign up to start managing your properties
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-8 pb-8">
          <div className="space-y-4">
            {/* Name */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <Input
                  {...register('name')}
                  type="text"
                  placeholder="Full name"
                  error={errors.name?.message}
                  className="pl-10"
                  fullWidth
                />
              </div>
            </div>

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

            {/* Password Confirmation */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <Input
                  {...register('password_confirmation')}
                  type="password"
                  placeholder="Confirm password"
                  error={errors.password_confirmation?.message}
                  className="pl-10"
                  fullWidth
                />
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Password must include:
              <br />
              • 8+ characters
              <br />
              • Uppercase and lowercase letter
              <br />
              • Number and special character (Example: Secure123!)
            </p>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Create Account
            </Button>
          </div>


          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RegisterPage;