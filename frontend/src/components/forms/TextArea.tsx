import { TextareaHTMLAttributes, forwardRef } from 'react';

/**
 * TextArea props
 */
interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

/**
 * TextArea component
 * Uses forwardRef for react-hook-form compatibility
 */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      className = '',
      id,
      rows = 4,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    const baseClasses = 'px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 resize-y';
    const errorClasses = error
      ? 'border-red-500 focus:ring-red-500'
      : 'border-gray-300';
    const widthClasses = fullWidth ? 'w-full' : '';
    const disabledClasses = props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white';

    const textareaClasses = `${baseClasses} ${errorClasses} ${widthClasses} ${disabledClasses} ${className}`;

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={textareaClasses}
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

TextArea.displayName = 'TextArea';

export default TextArea;