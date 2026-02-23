import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';

// Auth pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';

// Dashboard
import { DashboardPage } from '@/pages/dashboard/DashboardPage';

// Properties
import { PropertiesPage } from '@/pages/properties/PropertiesPage';
import { CreatePropertyPage } from '@/pages/properties/CreatePropertyPage';
import { EditPropertyPage } from '@/pages/properties/EditPropertyPage';

/**
 * AppRoutes component
 */
export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Public routes (login/register) */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Private routes (require authentication) */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/properties"
          element={
            <PrivateRoute>
              <PropertiesPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/properties/create"
          element={
            <PrivateRoute>
              <CreatePropertyPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/properties/:id/edit"
          element={
            <PrivateRoute>
              <EditPropertyPage />
            </PrivateRoute>
          }
        />

        {/* 404 - Not Found */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
                <p className="text-gray-600 mb-4">Page not found</p>
                <a
                  href="/dashboard"
                  className="text-blue-600 hover:text-blue-700"
                >
                  Go to Dashboard
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;