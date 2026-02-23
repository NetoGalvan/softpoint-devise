/**
 * Usage:
 * import { authApi, propertiesApi, dashboardApi } from '@/api';
 * Is a central barrel file that re-exports all API modules for easier importing
 */

export { apiClient } from './client';
export { authApi } from './auth';
export { propertiesApi } from './properties';
export { dashboardApi } from './dashboard';