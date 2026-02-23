import { z } from 'zod';

/**
 * Property schema
 */
export const propertySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(128, 'Name cannot exceed 128 characters'),

  real_estate_type: z.enum(['house', 'apartment', 'land', 'commercial_ground'],
    ('Property type is required'),
  ),

  street: z
    .string()
    .min(1, 'Street is required')
    .max(128, 'Street cannot exceed 128 characters'),

  external_number: z
    .string()
    .min(1, 'External number is required')
    .max(12, 'External number cannot exceed 12 characters'),

  internal_number: z
    .string()
    .max(12, 'Internal number cannot exceed 12 characters')
    .optional()
    .or(z.literal('')),

  neighborhood: z
    .string()
    .min(1, 'Neighborhood is required')
    .max(128, 'Neighborhood cannot exceed 128 characters'),

  city: z
    .string()
    .min(1, 'City is required')
    .max(64, 'City cannot exceed 64 characters'),

  country: z
    .string()
    .min(2, 'Country is required')
    .max(2, 'Country must be 2 characters (ISO code)'),

  rooms: z
    .number('Rooms must be a number')
    .int('Rooms must be a whole number')
    .min(0, 'Rooms cannot be negative')
    .max(20, 'Rooms cannot exceed 20'),

  bathrooms: z
    .number('Bathrooms must be a number')
    .min(0, 'Bathrooms cannot be negative')
    .max(10, 'Bathrooms cannot exceed 10')
    .step(0.5, 'Only full (1) or half (.5) bathrooms are allowed'),

  price: z
    .number('Price must be a number')
    .positive('Price must be positive')
    .max(999999999.99, 'Price is too high'),

  comments: z
    .string()
    .max(128, 'Comments cannot exceed 128 characters')
    .optional()
    .or(z.literal('')),
});

/**
 * TypeScript type from schema
 */
export type PropertyFormData = z.infer<typeof propertySchema>;