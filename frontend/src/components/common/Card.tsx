import React from 'react';

/**
 * Card props
 */
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

/**
 * Card component
 */
export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = true,
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-md border border-gray-200';
  const paddingClasses = padding ? 'p-6' : '';
  const classes = `${baseClasses} ${paddingClasses} ${className}`;

  return <div className={classes}>{children}</div>;
};

/**
 * Card Header
 */
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
}) => {
  const baseClasses = 'border-b border-gray-200 px-6 py-4';
  const classes = `${baseClasses} ${className}`;

  return <div className={classes}>{children}</div>;
};

/**
 * Card Body
 */
interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({
  children,
  className = '',
}) => {
  const baseClasses = 'px-6 py-4';
  const classes = `${baseClasses} ${className}`;

  return <div className={classes}>{children}</div>;
};

/**
 * Card Footer
 */
interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
}) => {
  const baseClasses = 'border-t border-gray-200 px-6 py-4';
  const classes = `${baseClasses} ${className}`;

  return <div className={classes}>{children}</div>;
};

export default Card;