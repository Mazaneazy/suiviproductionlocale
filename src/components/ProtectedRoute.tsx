
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole | UserRole[];
  moduleName?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
  moduleName 
}) => {
  const { isAuthenticated, hasRole, hasAccess } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Check roles if specified
  if (allowedRoles && !hasRole(allowedRoles)) {
    return <Navigate to="/unauthorized" />;
  }

  // Check module access if specified
  if (moduleName && !hasAccess(moduleName)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
