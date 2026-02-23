import { env } from '@/config/env';
import type { ApiError } from '@/types';

/**
 * API Client class
 * Wraps fetch API with authentication and error handling
 */
class ApiClient {

  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('auth_token');
  }

  /**
   * Set authentication token
   * Stores token in memory and localStorage
   */
  setToken(token: string | null): void {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Build request headers
   * Includes Content-Type and Authorization if token exists
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Handle API errors
   * Parses error response and throws appropriate error
   */
  private async handleError(response: Response): Promise<never> {
    let errorData: ApiError;

    try {
      errorData = await response.json();
    } catch {
      // If response is not JSON, create generic error
      errorData = {
        message: `HTTP Error ${response.status}: ${response.statusText}`,
      };
    }

    // If unauthorized (401), clear token
    if (response.status === 401) {
      this.setToken(null);
      // Redirect to login (will be handled by context)
    }

    throw errorData;
  }

  /**
   * Make HTTP request
   * Generic method for all HTTP methods
   * <T> allows us to specify the type of data we expect in the response, can be User, Property, etc.
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      // If response is not ok, handle error
      if (!response.ok) {
        await this.handleError(response);
      }

      // Parse JSON response
      const data = await response.json();
      return data as T;
    } catch (error) {
      // Re-throw API errors
      if ((error as ApiError).message) {
        throw error;
      }

      // Handle network errors
      throw {
        message: 'Network error. Please check your connection.',
      } as ApiError;
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

/**
 * Export singleton instance
 * Single instance shared across the app
 */
export const apiClient = new ApiClient(env.apiUrl);

export default apiClient;