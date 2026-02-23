import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/api';
import { apiClient } from '@/api/client';
import type { User, LoginCredentials, RegisterData, AuthContextValue } from '@/types';

/**
 * Create Auth Context
 * undefined means context must be used within provider
 */
export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

/**
 * Auth Provider Props
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth Provider Component
 * Wraps app and provides authentication state
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // State
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Initialize auth state from localStorage
   * Runs once on mount
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get token from localStorage
        const storedToken = localStorage.getItem('auth_token');

        if (storedToken) {
          // Set token in API client
          apiClient.setToken(storedToken);
          setToken(storedToken);

          // Fetch current user
          const response = await authApi.me();
          setUser(response.user);
        }
      } catch (error) {
        // If token is invalid, clear it
        console.error('Failed to initialize auth:', error);
        localStorage.removeItem('auth_token');
        apiClient.setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login user
   */
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      const response = await authApi.login(credentials);

      // Set token and user
      setToken(response.token);
      setUser(response.user);

      // Token is already stored in apiClient by authApi.login
    } catch (error) {
      // Re-throw error to be handled by login form
      throw error;
    }
  };

  /**
   * Register new user
   */
  const register = async (data: RegisterData): Promise<void> => {
    try {
      const response = await authApi.register(data);

      // Set token and user
      setToken(response.token);
      setUser(response.user);

      // Token is already stored in apiClient by authApi.register
    } catch (error) {
      // Re-throw error to be handled by register form
      throw error;
    }
  };

  /**
   * Logout user
   */
  const logout = async (): Promise<void> => {
    try {
      // Call logout endpoint (optional, handles server-side cleanup)
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear state regardless of API call success
      setUser(null);
      setToken(null);

      // Clear token from localStorage and API client
      localStorage.removeItem('auth_token');
      apiClient.setToken(null);
    }
  };

  /**
   * Context value
   */
  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;