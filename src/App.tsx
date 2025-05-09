
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Accueil from './pages/Accueil';
import Dossiers from './pages/Dossiers';
import Inspections from './pages/Inspections';
import Certificats from './pages/Certificats';
import Statistiques from './pages/Statistiques';
import NotesFrais from './pages/NotesFrais';
import UserManagement from './pages/UserManagement';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserDetails from './pages/UserDetails';
import UserProfile from './pages/UserProfile';
import Index from './pages/Index';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, redirectPath, accessPermissions }: {
  children: React.ReactNode;
  redirectPath: string;
  accessPermissions: string[];
}) => {
  const { isAuthenticated, hasAccess, hasRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has admin or director general role
  const isAdminOrDirector = hasRole(['admin', 'directeur_general']);
  
  // Check if user has at least one of the required permissions
  const hasRequiredPermissions = accessPermissions.some(permission => 
    hasAccess(permission) || isAdminOrDirector
  );

  if (!hasRequiredPermissions) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/" element={<Index />} />
                
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute
                      redirectPath="/unauthorized"
                      accessPermissions={['dashboard']}
                    >
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/accueil"
                  element={
                    <ProtectedRoute
                      redirectPath="/unauthorized"
                      accessPermissions={['acceuil']}
                    >
                      <Accueil />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/dossiers"
                  element={
                    <ProtectedRoute
                      redirectPath="/unauthorized"
                      accessPermissions={['dossiers']}
                    >
                      <Dossiers />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/inspections"
                  element={
                    <ProtectedRoute
                      redirectPath="/unauthorized"
                      accessPermissions={['inspections']}
                    >
                      <Inspections />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/certificats"
                  element={
                    <ProtectedRoute
                      redirectPath="/unauthorized"
                      accessPermissions={['resultats']}
                    >
                      <Certificats />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/statistiques"
                  element={
                    <ProtectedRoute
                      redirectPath="/unauthorized"
                      accessPermissions={['statistiques']}
                    >
                      <Statistiques />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/notes-frais"
                  element={
                    <ProtectedRoute
                      redirectPath="/unauthorized"
                      accessPermissions={['notes-frais']}
                    >
                      <NotesFrais />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/responsable-technique"
                  element={
                    <ProtectedRoute
                      redirectPath="/unauthorized"
                      accessPermissions={['responsable-technique']}
                    >
                      <ResponsableTechnique />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/user-management"
                  element={
                    <ProtectedRoute
                      redirectPath="/unauthorized"
                      accessPermissions={['user-management']}
                    >
                      <UserManagement />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/user-details/:userId"
                  element={
                    <ProtectedRoute
                      redirectPath="/unauthorized"
                      accessPermissions={['user-management']}
                    >
                      <UserDetails />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/user-profile/:userId"
                  element={
                    <ProtectedRoute
                      redirectPath="/unauthorized"
                      accessPermissions={['user-management']}
                    >
                      <UserProfile />
                    </ProtectedRoute>
                  }
                />
                
              </Routes>
            </BrowserRouter>
            <Toaster />
          </QueryClientProvider>
        </ThemeProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
