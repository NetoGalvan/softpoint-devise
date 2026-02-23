/**
 * Pagination
 */
export const ITEMS_PER_PAGE = 15;
export const MAX_ITEMS_PER_PAGE = 50;

/**
 * Validation
 */
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_NAME_LENGTH = 128;
export const MAX_COMMENT_LENGTH = 128;

/**
 * Country codes (ISO 3166 Alpha-2)
 * Common countries for property management
 */
export const COUNTRY_OPTIONS = [
  { value: 'US', label: 'United States' },
  { value: 'MX', label: 'México' },
  { value: 'CA', label: 'Canada' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'ES', label: 'Spain' },
  { value: 'FR', label: 'France' },
  { value: 'DE', label: 'Germany' },
  { value: 'IT', label: 'Italy' },
  { value: 'BR', label: 'Brazil' },
  { value: 'AR', label: 'Argentina' },
] as const;

/**
 * Sort options for properties
 */
export const SORT_OPTIONS = [
  { value: 'created_at', label: 'Date Added' },
  { value: 'price', label: 'Price' },
  { value: 'name', label: 'Name' },
  { value: 'rooms', label: 'Rooms' },
  { value: 'bathrooms', label: 'Bathrooms' },
] as const;

/**
 * Sort order options
 */
export const SORT_ORDER_OPTIONS = [
  { value: 'desc', label: 'Descending' },
  { value: 'asc', label: 'Ascending' },
] as const;

/**
 * Chart colors for property types
 */
export const CHART_COLORS = {
  house: '#3B82F6',           // Blue
  apartment: '#10B981',       // Green
  land: '#F59E0B',            // Amber
  commercial_ground: '#8B5CF6', // Purple
};

/**
 * Toast notification duration (ms)
 */
export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 5000,
};

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
} as const;

/**
 * Routes
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROPERTIES: '/properties',
  PROPERTIES_CREATE: '/properties/create',
  PROPERTIES_EDIT: '/properties/:id/edit',
} as const;