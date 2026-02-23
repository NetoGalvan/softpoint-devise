import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { FullPageSpinner } from '@/components/common';

/**
 * PrivateRoute props
 */
interface PrivateRouteProps {
  children: React.ReactElement;
}

/**
 * PrivateRoute component
 * Wraps routes that require authentication
 */
export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <FullPageSpinner />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return children;
};

export default PrivateRoute;