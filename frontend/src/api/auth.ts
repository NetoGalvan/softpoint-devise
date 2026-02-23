import { apiClient } from './client';
import type { LoginCredentials, RegisterData, AuthResponse, User } from '@/types';

/**
 * Auth API endpoints
 */
export const authApi = {
  /**
   * Login user
   * POST /api/auth/login
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      '/auth/login',
      credentials
    );

    // Store token in client
    if (response.token) {
      apiClient.setToken(response.token);
    }

    return response;
  },

  /**
   * Register new user
   * POST /api/auth/register
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      '/auth/register',
      data
    );

    // Store token in client
    if (response.token) {
      apiClient.setToken(response.token);
    }

    return response;
  },

  /**
   * Logout user
   * POST /api/auth/logout
   */
  logout: async (): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      '/auth/logout'
    );

    // Clear token from client
    apiClient.setToken(null);

    return response;
  },

  /**
   * Get current authenticated user
   * GET /api/auth/me
   */
  me: async (): Promise<{ user: User }> => {
    return await apiClient.get<{ user: User }>('/auth/me');
  },
};

export default authApi;