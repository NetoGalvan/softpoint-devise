import { RealEstateType } from './property';

/**
 * Dashboard statistics
 */
export interface DashboardStatistics {
  total_properties: number;
  total_inactive_properties: number;
  total_active_properties: number;
  average_price: number;
  total_value: number;
}

/**
 * Properties by type
 * Used for chart data
 */
export interface PropertiesByType {
  type: RealEstateType;
  count: number;
  average_price: number;
}

/**
 * Recent property
 * Simplified property data for recent list
 */
export interface RecentProperty {
  id: number;
  name: string;
  type: RealEstateType;
  price: number;
  city: string;
  created_at: string;
}

/**
 * Dashboard response from API
 */
export interface DashboardResponse {
  statistics: DashboardStatistics;
  properties_by_type: PropertiesByType[];
  recent_properties: RecentProperty[];
}

/**
 * Chart data point
 * Generic structure for chart libraries
 */
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}