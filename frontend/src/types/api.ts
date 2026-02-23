/**
 * API Error response
 * Standard error structure from backend
 */
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>; // Validation errors
}

/**
 * API Success response (generic) y felxible for different data types
 * <T> allows us to specify the type of data we expect in the response, can be User, Property, etc.
 * example: ApiResponse<User> for user-related endpoints, ApiResponse<Property[]> for list of properties, etc.
 */
export interface ApiResponse<T> {
  message?: string;
  data: T;
}

/**
 * Validation errors
 * Key-value pairs of field errors
 */
export type ValidationErrors = Record<string, string[]>;

/**
 * HTTP Methods
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Request options
 */
export interface RequestOptions {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: string;
}

/**
 * API Client configuration
 */
export interface ApiClientConfig {
  baseUrl: string;
  token?: string | null;
}