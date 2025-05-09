
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check if admin or director general (they have access to everything)
  const isAdminOrDirector = hasRole(['admin', 'directeur_general']);
  
  // Check roles if specified
  if (allowedRoles && !hasRole(allowedRoles) && !isAdminOrDirector) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // Check module access if specified
  if (moduleName && !hasAccess(moduleName) && !isAdminOrDirector) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
