/**
 * useApi Hook
 *
 * Generic hook for handling API calls
 * Manages loading, error, and data states
 *
 * Usage:
 * const { data, loading, error, execute } = useApi(propertiesApi.getAll);
 */

import { useState, useCallback } from 'react';
import type { ApiError } from '@/types';

/**
 * API Hook return type
 */
interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  execute: (...args: any[]) => Promise<T | undefined>;
  reset: () => void;
}

/**
 * useApi hook
 * Generic hook for API calls
 */
export const useApi = <T,>(
  apiFunction: (...args: any[]) => Promise<T>
): UseApiResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  /**
   * Execute API call
   */
  const execute = useCallback(
    async (...args: any[]): Promise<T | undefined> => {
      try {
        setLoading(true);
        setError(null);

        const result = await apiFunction(...args);
        setData(result);

        return result;
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError);
        throw apiError; // Re-throw so caller can handle
      } finally {
        setLoading(false);
      }
    },
    [apiFunction]
  );

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

export default useApi;