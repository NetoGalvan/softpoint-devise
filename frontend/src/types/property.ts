/**
 * Real estate types
 * Matches backend enum values
 */
export type RealEstateType = 'house' | 'apartment' | 'land' | 'commercial_ground';

/**
 * Property interface
 * Represents a property in the system
 */
export interface Property {
  id: number;
  user_id: number;
  name: string;
  real_estate_type: RealEstateType;
  street: string;
  external_number: string;
  internal_number: string | null;
  neighborhood: string;
  city: string;
  country: string;
  rooms: number;
  bathrooms: number;
  price: number;
  comments: string | null;
  status: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Property form data
 * Data structure for creating/updating properties
 */
export interface PropertyFormData {
  name: string;
  real_estate_type: RealEstateType;
  street: string;
  external_number: string;
  internal_number?: string;
  neighborhood: string;
  city: string;
  country: string;
  rooms: number;
  bathrooms: number;
  price: number;
  comments?: string;
}

/**
 * Property filters
 * Used for filtering property list
 */
export interface PropertyFilters {
  type?: RealEstateType;
  city?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: 'price' | 'created_at' | 'name' | 'rooms' | 'bathrooms';
  sort_order?: 'asc' | 'desc';
}

/**
 * Paginated properties response
 */
export interface PaginatedPropertiesResponse {
  data: Property[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

/**
 * Property response (single)
 */
export interface PropertyResponse {
  message: string;
  data: Property;
}

/**
 * Real estate type labels
 * Record is used to map enum values by key
 */
export const REAL_ESTATE_TYPE_LABELS: Record<RealEstateType, string> = {
  house: 'House',
  apartment: 'Apartment',
  land: 'Land',
  commercial_ground: 'Commercial Ground',
};

/**
 * Real estate type options
 * For select/dropdown components
 */
export const REAL_ESTATE_TYPE_OPTIONS = [
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'land', label: 'Land' },
  { value: 'commercial_ground', label: 'Commercial Ground' },
] as const;