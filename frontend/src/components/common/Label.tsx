import React, { LabelHTMLAttributes } from 'react';

/**
 * Label props
 */
interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  children: React.ReactNode;
}

/**
 * Label component
 */
export const Label: React.FC<LabelProps> = ({
  required = false,
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'block text-sm font-medium text-gray-700';
  const classes = `${baseClasses} ${className}`;

  return (
    <label className={classes} {...props}>
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

export default Label;