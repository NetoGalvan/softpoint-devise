import { apiClient } from './client';
import type { PropertyFormData, PropertyFilters, PaginatedPropertiesResponse, PropertyResponse } from '@/types';

/**
 * Properties API endpoints
 */
export const propertiesApi = {
  /**
   * Get all properties (with filters)
   * GET /api/properties
   */
  getAll: async (
    filters: PropertyFilters = {},
    page: number = 1,
    perPage: number = 15
  ): Promise<PaginatedPropertiesResponse> => {
    const queryParams = new URLSearchParams();

    // Add pagination
    queryParams.append('page', page.toString());
    queryParams.append('per_page', perPage.toString());

    // Add filters
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.city) queryParams.append('city', filters.city);
    if (filters.min_price) queryParams.append('min_price', filters.min_price.toString());
    if (filters.max_price) queryParams.append('max_price', filters.max_price.toString());
    if (filters.sort_by) queryParams.append('sort_by', filters.sort_by);
    if (filters.sort_order) queryParams.append('sort_order', filters.sort_order);

    const queryString = queryParams.toString();
    const endpoint = `/properties${queryString ? `?${queryString}` : ''}`;

    return await apiClient.get<PaginatedPropertiesResponse>(endpoint);
  },

  /**
   * Get single property by ID
   * GET /api/properties/:id
   */
  getById: async (id: number): Promise<PropertyResponse> => {
    return await apiClient.get<PropertyResponse>(`/properties/${id}`);
  },

  /**
   * Create new property
   * POST /api/properties
   */
  create: async (data: PropertyFormData): Promise<PropertyResponse> => {
    return await apiClient.post<PropertyResponse>('/properties', data);
  },

  /**
   * Update existing property
   * PUT /api/properties/:id
   */
  update: async (
    id: number,
    data: Partial<PropertyFormData>
  ): Promise<PropertyResponse> => {
    return await apiClient.put<PropertyResponse>(`/properties/${id}`, data);
  },

  /**
   * Delete property
   * DELETE /api/properties/:id
   */
  delete: async (id: number): Promise<{ message: string }> => {
    return await apiClient.delete<{ message: string }>(`/properties/${id}`);
  },
};

export default propertiesApi;