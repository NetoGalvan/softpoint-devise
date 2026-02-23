import React from 'react';

/**
 * Badge variants
 */
type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

/**
 * Badge props
 */
interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

/**
 * Get variant classes
 */
const getVariantClasses = (variant: BadgeVariant): string => {
  const variants = {
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  return variants[variant];
};

/**
 * Badge component
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border';
  const variantClasses = getVariantClasses(variant);
  const classes = `${baseClasses} ${variantClasses} ${className}`;

  return <span className={classes}>{children}</span>;
};

export default Badge;