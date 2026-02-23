/**
 * Formatters
 *
 * Utility functions for formatting data for display
 */

import { REAL_ESTATE_TYPE_LABELS } from '@/types';
import type { RealEstateType } from '@/types';

/**
 * Format number as currency
 *
 * @param amount - Number to format
 * @param currency - Currency code (default: USD)
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(1500000) // "$1,500,000.00"
 * formatCurrency(2500, 'MXN') // "MX$2,500.00"
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD'
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format number with thousands separator
 *
 * @param num - Number to format
 * @returns Formatted number string
 *
 * @example
 * formatNumber(1500000) // "1,500,000"
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Format date to readable string
 *
 * @param date - Date string or Date object
 * @param format - Format style ('short', 'medium', 'long')
 * @returns Formatted date string
 *
 * @example
 * formatDate('2024-01-15') // "Jan 15, 2024"
 * formatDate('2024-01-15', 'long') // "January 15, 2024"
 */
export const formatDate = (
  date: string | Date,
  format: 'short' | 'medium' | 'long' = 'medium'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    medium: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { month: 'long', day: 'numeric', year: 'numeric' },
  }[format] as Intl.DateTimeFormatOptions;

  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
};

/**
 * Format date to relative time
 *
 * @param date - Date string or Date object
 * @returns Relative time string
 *
 * @example
 * formatRelativeTime('2024-01-15') // "2 days ago"
 * formatRelativeTime('2024-01-20') // "in 3 days"
 */
export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(Math.abs(diffInSeconds) / secondsInUnit);

    if (interval >= 1) {
      const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
      return rtf.format(
        diffInSeconds < 0 ? interval : -interval,
        unit as Intl.RelativeTimeFormatUnit
      );
    }
  }

  return 'just now';
};

/**
 * Format real estate type to display name
 *
 * @param type - Real estate type
 * @returns Human-readable label
 *
 * @example
 * formatPropertyType('house') // "House"
 * formatPropertyType('commercial_ground') // "Commercial Ground"
 */
export const formatPropertyType = (type: RealEstateType): string => {
  return REAL_ESTATE_TYPE_LABELS[type] || type;
};

/**
 * Truncate text to specified length
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text with ellipsis
 *
 * @example
 * truncateText('This is a long text', 10) // "This is a..."
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Format address from property fields
 *
 * @param street - Street name
 * @param externalNumber - External number
 * @param internalNumber - Internal number (optional)
 * @param city - City
 * @param country - Country code
 * @returns Formatted address string
 *
 * @example
 * formatAddress('Main St', '123', 'A', 'NYC', 'US')
 * // "123 Main St A, NYC, US"
 */
export const formatAddress = (
  street: string,
  externalNumber: string,
  internalNumber: string | null,
  city: string,
  country: string
): string => {
  const parts = [
    externalNumber,
    street,
    internalNumber || '',
    city,
    country.toUpperCase(),
  ].filter(Boolean);

  return parts.join(' ');
};