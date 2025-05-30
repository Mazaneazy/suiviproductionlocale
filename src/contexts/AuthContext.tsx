
import React, { createContext, useState, useEffect } from 'react';
import { User, UserRole, Dossier } from '@/types';
import { generateId } from './data/utils';
import { MOCK_USERS } from '@/data/mockUsers';
import { rolePermissionsMap, moduleNames } from '@/constants/authConstants';
import { AuthContextProps } from './AuthContextTypes';

// Create the context with default values
export const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  login: async () => false,
  logout: () => {},
  getAllUsers: () => [],
  getUserById: () => undefined,
  createUser: async () => false,
  hasAccess: () => false,
  hasRole: () => false, 
  isAuthenticated: false,
  getUserActions: () => [],
  createProducteurAccount: () => ({} as User),
  resetPassword: async () => false,
});

// Export module names for use in other components
export { moduleNames } from '@/constants/authConstants';

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize mockUsers from the imported data
  let mockUsers = [...MOCK_USERS];

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    // Save current user to local storage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  // Login function
  const login = async (email: string, password: string) => {
    const user = mockUsers.find(user => user.email === email && user.password === password);
    if (user) {
      setCurrentUser(user);

      // Add login action
      addUserAction(user.id, 'Connexion', 'Connexion réussie', 'auth');
      return true;
    }
    return false;
  };

  // Logout function
  const logout = () => {
    if (currentUser) {
      // Add logout action
      addUserAction(currentUser.id, 'Déconnexion', 'Déconnexion réussie', 'auth');
    }
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  // Get all users
  const getAllUsers = () => {
    return mockUsers;
  };

  // Get user by ID
  const getUserById = (id: string) => {
    return mockUsers.find(user => user.id === id);
  };

  // Helper to get permissions based on role
  const getPermissionsForRole = (role: UserRole): string[] => {
    return rolePermissionsMap[role] || [];
  };

  // Create user with automatic permissions based on role
  const createUser = async (user: Omit<User, 'id'>) => {
    // Assign permissions based on role
    const permissions = getPermissionsForRole(user.role);
    
    const newUser: User = {
      id: generateId(),
      ...user,
      permissions,
      password: 'password', // Default password
      actions: []
    };
    mockUsers.push(newUser);

    // Add creation action
    addUserAction(newUser.id, 'Création de compte', `Compte créé avec le rôle ${newUser.role}`, 'user-management');
    return true;
  };

  // Password reset function
  const resetPassword = async (email: string): Promise<boolean> => {
    // Find user with this email
    const user = mockUsers.find(user => user.email === email);
    
    if (user) {
      // In a real app, we would send an email here
      // For this mock version, we'll just reset the password to 'newpassword'
      user.password = 'newpassword';
      
      // Add password reset action
      addUserAction(user.id, 'Réinitialisation mot de passe', 'Mot de passe réinitialisé', 'auth');
      
      return true;
    }
    return false;
  };

  // Check if user has access to a module
  const hasAccess = (moduleName: string) => {
    if (!currentUser) return false;
    return currentUser.permissions?.includes(moduleName) || currentUser.permissions?.includes('*');
  };

  // Check if user has a specific role
  const hasRole = (roles: UserRole | UserRole[]) => {
    if (!currentUser) return false;
    if (Array.isArray(roles)) {
      return roles.includes(currentUser.role);
    }
    return currentUser.role === roles;
  };

  // Add user action
  const addUserAction = (userId: string, action: string, details: string, module: string) => {
    const user = mockUsers.find(user => user.id === userId);
    if (user) {
      const newAction = {
        id: generateId(),
        userId: userId,
        date: new Date().toISOString(),
        action: action,
        details: details,
        module: module
      };
      user.actions = [...(user.actions || []), newAction];
    }
  };

  // Get user actions
  const getUserActions = (userId: string) => {
    const user = mockUsers.find(user => user.id === userId);
    return user?.actions || [];
  };

  // Create producteur account
  const createProducteurAccount = (dossier: Dossier) => {
    const newUser: User = {
      id: generateId(),
      name: dossier.operateurNom,
      email: `${dossier.operateurNom.toLowerCase().replace(/\s+/g, '.')}@producteur.anor.cm`,
      role: 'producteur',
      password: 'password',
      producteurDossierId: dossier.id,
      permissions: ['dashboard'],
      actions: []
    };
    
    mockUsers.push(newUser);
    return newUser;
  };

  const isAuthenticated = currentUser !== null;

  return (
    <AuthContext.Provider value={{
      currentUser,
      login,
      logout,
      getAllUsers,
      getUserById,
      createUser,
      hasAccess,
      hasRole,
      isAuthenticated,
      getUserActions,
      createProducteurAccount,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the useAuth hook directly from this file
export { useAuth } from '../hooks/useAuth';
