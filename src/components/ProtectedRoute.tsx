
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
    return <Navigate to="/login" />;
  }
  
  // Vérifier les rôles si spécifiés
  if (allowedRoles && !hasRole(allowedRoles)) {
    return <Navigate to="/unauthorized" />;
  }

  // Vérifier l'accès au module si spécifié
  if (moduleName && !hasAccess(moduleName)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
