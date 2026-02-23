/**
 * User interface
 * Represents a user in the system
 */
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Login credentials
 * Data required for user login
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Register data
 * Data required for user registration
 */
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

/**
 * Auth response from backend
 * Response after successful login or registration
 */
export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

/**
 * Auth context value
 * State and methods available in AuthContext
 */
export interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}