import React, { ButtonHTMLAttributes } from 'react';

/**
 * Button variants
 */
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';

/**
 * Button sizes
 */
type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Button props
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

/**
 * Get variant classes
 */
const getVariantClasses = (variant: ButtonVariant): string => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white border-transparent',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white border-transparent',
    danger: 'bg-red-600 hover:bg-red-700 text-white border-transparent',
    outline: 'bg-transparent hover:bg-gray-50 text-gray-700 border-gray-300',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border-transparent',
  };

  return variants[variant];
};

/**
 * Get size classes
 */
const getSizeClasses = (size: ButtonSize): string => {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return sizes[size];
};

/**
 * Button component
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled = false,
  children,
  className = '',
  type = 'button',
  ...props
}) => {
  const baseClasses = 'font-medium rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center';

  const variantClasses = getVariantClasses(variant);
  const sizeClasses = getSizeClasses(size);
  const widthClasses = fullWidth ? 'w-full' : '';

  const classes = `${baseClasses} ${variantClasses} ${sizeClasses} ${widthClasses} ${className}`;

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
            <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
            </svg>
      )}
      {children}
    </button>
  );
};

export default Button;