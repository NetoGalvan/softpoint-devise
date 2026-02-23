/**
 * Usage:
 * import { User, Property, DashboardStatistics } from '@/types';
 * Is a central barrel file that re-exports all types from the types directory
 */

// Auth types
export type {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  AuthContextValue,
} from './auth';

// Property types
export type {
  Property,
  PropertyFormData,
  PropertyFilters,
  PaginatedPropertiesResponse,
  PropertyResponse,
  RealEstateType,
} from './property';

export {
  REAL_ESTATE_TYPE_LABELS,
  REAL_ESTATE_TYPE_OPTIONS,
} from './property';

// Dashboard types
export type {
  DashboardStatistics,
  PropertiesByType,
  RecentProperty,
  DashboardResponse,
  ChartDataPoint,
} from './dashboard';

// API types
export type {
  ApiError,
  ApiResponse,
  ValidationErrors,
  HttpMethod,
  RequestOptions,
  ApiClientConfig,
} from './api';