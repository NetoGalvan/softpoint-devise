/**
 * Usage:
 * const toast = useToast();
 * toast.success('Property created!');
 * toast.error('Failed to save');
 */

import { toast as hotToast } from 'react-hot-toast';
import type { ApiError } from '@/types';

/**
 * Toast options interface
 */
interface ToastOptions {
  duration?: number;
  position?: 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right';
}

/**
 * Default toast options
 */
const defaultOptions: ToastOptions = {
  duration: 3000,
  position: 'top-right',
};

/**
 * useToast hook
 * Provides toast notification methods
 */
export const useToast = () => {
  /**
   * Success toast
   */
  const success = (message: string, options?: ToastOptions) => {
    return hotToast.success(message, {
      ...defaultOptions,
      ...options,
    });
  };

  /**
   * Error toast
   * Handles ApiError objects or simple strings
   */
  const error = (error: string | ApiError, options?: ToastOptions) => {
    const message = typeof error === 'string' ? error : error.message;

    return hotToast.error(message, {
      ...defaultOptions,
      duration: 4000, // Longer duration for errors
      ...options,
    });
  };

  /**
   * Info toast
   */
  const info = (message: string, options?: ToastOptions) => {
    return hotToast(message, {
      ...defaultOptions,
      ...options,
      icon: 'ℹ️',
    });
  };

  /**
   * Warning toast
   */
  const warning = (message: string, options?: ToastOptions) => {
    return hotToast(message, {
      ...defaultOptions,
      ...options,
      icon: '⚠️',
    });
  };

  /**
   * Loading toast
   * Shows while async operation is in progress
   */
  const loading = (message: string) => {
    return hotToast.loading(message);
  };

  /**
   * Dismiss toast
   */
  const dismiss = (toastId?: string) => {
    return hotToast.dismiss(toastId);
  };

  /**
   * Promise toast
   * Shows loading, success, and error states automatically
   */
  const promise = <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return hotToast.promise(promise, messages, {
      ...defaultOptions,
    });
  };

  return {
    success,
    error,
    info,
    warning,
    loading,
    dismiss,
    promise,
  };
};

export default useToast;