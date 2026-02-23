import { InputHTMLAttributes, forwardRef } from 'react';

/**
 * Input props
 */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

/**
 * Input component
 * Uses forwardRef for react-hook-form compatibility
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      className = '',
      id,
      type = 'text',
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseClasses = 'px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200';
    const errorClasses = error
      ? 'border-red-500 focus:ring-red-500'
      : 'border-gray-300';
    const widthClasses = fullWidth ? 'w-full' : '';
    const disabledClasses = props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white';

    const inputClasses = `${baseClasses} ${errorClasses} ${widthClasses} ${disabledClasses} ${className}`;

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          className={inputClasses}
          {...props}
        />

        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;