
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
});

// Export module names for use in other components
export { moduleNames } from '@/constants/authConstants';

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize mockUsers from the imported data
  const [mockUsers, setMockUsers] = useState<User[]>(() => {
    const storedUsers = localStorage.getItem('mockUsers');
    return storedUsers ? JSON.parse(storedUsers) : [...MOCK_USERS];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Save mockUsers to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
  }, [mockUsers]);

  useEffect(() => {
    // Save current user to local storage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  // Login function
  const login = async (email: string, password: string) => {
    const user = mockUsers.find(user => user.email === email && user.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  // Logout function
  const logout = () => {
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

  // Create user with automatic permissions based on role and password
  const createUser = async (user: Omit<User, 'id'>) => {
    // Assign permissions based on role
    const permissions = getPermissionsForRole(user.role);
    
    const newUser: User = {
      id: generateId(),
      ...user,
      permissions,
      actions: []
    };
    
    setMockUsers(prevUsers => [...prevUsers, newUser]);
    return true;
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
    const updatedUsers = mockUsers.map(user => {
      if (user.id === userId) {
        const newAction = {
          id: generateId(),
          userId: userId,
          date: new Date().toISOString(),
          action: action,
          details: details,
          module: module
        };
        return {
          ...user,
          actions: [...(user.actions || []), newAction]
        };
      }
      return user;
    });
    
    setMockUsers(updatedUsers);
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
    
    setMockUsers(prevUsers => [...prevUsers, newUser]);
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
      createProducteurAccount
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the useAuth hook directly from this file
export { useAuth } from '../hooks/useAuth';
