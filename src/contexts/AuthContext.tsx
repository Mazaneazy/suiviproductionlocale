
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, UserRole } from '../types';
import { generateId } from './data/utils';
import { Dossier } from '../types';

// Define the AuthContext type
interface AuthContextProps {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  getAllUsers: () => User[];
  getUserById: (id: string) => User | undefined;
  createUser: (user: Omit<User, 'id'>) => Promise<boolean>;
  hasAccess: (moduleName: string) => boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean; // Added method
  isAuthenticated: boolean; // Added property
  getUserActions: (userId: string) => any[];
  createProducteurAccount: (dossier: Dossier) => User;
}

// Create the context with default values
const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  login: async () => false,
  logout: () => {},
  getAllUsers: () => [],
  getUserById: () => undefined,
  createUser: async () => false,
  hasAccess: () => false,
  hasRole: () => false, // Added method
  isAuthenticated: false, // Added property
  getUserActions: () => [],
  createProducteurAccount: () => ({} as User),
});

// Mock user data (replace with a real database or API)
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    password: 'password',
    permissions: ['*'],
    actions: []
  },
  {
    id: '2',
    name: 'Accueil User',
    email: 'accueil@example.com',
    role: 'acceuil',
    password: 'password',
    permissions: ['acceuil'],
    actions: []
  },
  {
    id: '3',
    name: 'Inspecteur User',
    email: 'inspecteur@example.com',
    role: 'inspecteur',
    password: 'password',
    permissions: ['inspections'],
    actions: []
  },
  {
    id: '4',
    name: 'Certificats User',
    email: 'certificats@example.com',
    role: 'certificats',
    password: 'password',
    permissions: ['resultats'],
    actions: []
  },
    {
    id: '5',
    name: 'Analyste User',
    email: 'analyste@example.com',
    role: 'analyste',
    password: 'password',
    permissions: ['statistiques'],
    actions: []
  },
  {
    id: '6',
    name: 'Comptable User',
    email: 'comptable@example.com',
    role: 'comptable',
    password: 'password',
    permissions: ['notes-frais'],
    actions: []
  },
  {
    id: '7',
    name: 'Responsable Technique',
    email: 'rt@example.com',
    role: 'responsable_technique',
    password: 'password',
    permissions: ['responsable-technique'],
    actions: []
  },
  {
    id: '8',
    name: 'Chef de Mission',
    email: 'chef.mission@example.com',
    role: 'chef_mission',
    password: 'password',
    permissions: ['inspections'],
    actions: []
  },
  {
    id: '9',
    name: 'Surveillant User',
    email: 'surveillant@example.com',
    role: 'surveillant',
    password: 'password',
    permissions: ['inspections'],
    actions: []
  },
  {
    id: '10',
    name: 'Directeur User',
    email: 'directeur@example.com',
    role: 'directeur',
    password: 'password',
    permissions: ['resultats'],
    actions: []
  },
  {
    id: '11',
    name: 'Directeur General',
    email: 'dg@example.com',
    role: 'directeur_general',
    password: 'password',
    permissions: ['*'],
    actions: []
  },
  {
    id: '12',
    name: 'Gestionnaire Dossiers',
    email: 'gestionnaire@example.com',
    role: 'gestionnaire',
    password: 'password',
    permissions: ['dossiers'],
    actions: []
  },
];

let mockUsers = [...MOCK_USERS];

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  // Create user
  const createUser = async (user: Omit<User, 'id'>) => {
    const newUser: User = {
      id: generateId(),
      ...user,
      password: 'password', // Default password
      actions: []
    };
    mockUsers.push(newUser);

    // Add creation action
    addUserAction(newUser.id, 'Création de compte', `Compte créé avec le rôle ${newUser.role}`, 'user-management');
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
      createProducteurAccount
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
