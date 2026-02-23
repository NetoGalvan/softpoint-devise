import { apiClient } from './client';
import type { DashboardResponse } from '@/types';

/**
 * Dashboard API endpoints
 */
export const dashboardApi = {
  /**
   * Get dashboard statistics
   * GET /api/dashboard
   */
  getStats: async (): Promise<DashboardResponse> => {
    return await apiClient.get<DashboardResponse>('/dashboard');
  },
};

export default dashboardApi;