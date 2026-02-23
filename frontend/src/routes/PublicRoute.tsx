import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { FullPageSpinner } from '@/components/common';

/**
 * PublicRoute props
 */
interface PublicRouteProps {
  children: React.ReactElement;
}

/**
 * PublicRoute component
 * Wraps routes like login/register
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <FullPageSpinner />;
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render children if not authenticated
  return children;
};

export default PublicRoute;