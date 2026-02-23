import { SelectHTMLAttributes, forwardRef } from 'react';

/**
 * Select option interface
 */
export interface SelectOption {
  readonly value: string | number;
  readonly label: string;
}

/**
 * Select props
 */
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: readonly SelectOption[] | SelectOption[];  // ← Acepta readonly
  placeholder?: string;
  fullWidth?: boolean;
}

/**
 * Select component
 * Uses forwardRef for react-hook-form compatibility
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder = 'Select an option...',
      fullWidth = false,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    const baseClasses = 'px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200';
    const errorClasses = error
      ? 'border-red-500 focus:ring-red-500'
      : 'border-gray-300';
    const widthClasses = fullWidth ? 'w-full' : '';
    const disabledClasses = props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white';

    const selectClasses = `${baseClasses} ${errorClasses} ${widthClasses} ${disabledClasses} ${className}`;

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <select
          ref={ref}
          id={selectId}
          className={selectClasses}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

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

Select.displayName = 'Select';

export default Select;