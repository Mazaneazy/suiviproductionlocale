
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextProps {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  hasAccess: (module: string) => boolean;
  createUser: (userData: Omit<User, "id">) => Promise<boolean>;
  getAllUsers: () => User[];
}

const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  hasRole: () => false,
  hasAccess: () => false,
  createUser: async () => false,
  getAllUsers: () => [],
});

// Mock users for demo purposes
const INITIAL_MOCK_USERS: User[] = [
  { id: '1', name: 'Admin', email: 'admin@certif.com', role: 'admin', avatar: '' },
  { id: '2', name: 'Poste d\'Accueil', email: 'acceuil@certif.com', role: 'acceuil', avatar: '' },
  { id: '3', name: 'Chef des Inspections', email: 'inspecteur@certif.com', role: 'inspecteur', avatar: '' },
  { id: '4', name: 'Responsable Notes de Frais', email: 'comptable@certif.com', role: 'comptable', avatar: '' },
  { id: '5', name: 'Chargé du reporting', email: 'analyste@certif.com', role: 'analyste', avatar: '' },
  { id: '6', name: 'Chef de Mission d\'Inspection', email: 'chef_mission@certif.com', role: 'chef_mission', avatar: '' },
  { id: '7', name: 'Directeur Evaluation Conformité', email: 'directeur@certif.com', role: 'directeur', avatar: '' },
  { id: '8', name: 'Responsable Technique', email: 'technique@certif.com', role: 'responsable_technique', avatar: '' },
  { id: '9', name: 'Délivrance des Certificats', email: 'certificats@certif.com', role: 'certificats', avatar: '' },
  { id: '10', name: 'Directeur Général ANOR', email: 'dg@certif.com', role: 'directeur_general', avatar: '' },
  { id: '11', name: 'Gestionnaire', email: 'gestionnaire@certif.com', role: 'gestionnaire', avatar: '' },
];

// Définir les accès par module pour chaque rôle
const ROLE_ACCESS_MAP: Record<string, string[]> = {
  'admin': ['dossiers', 'inspections', 'certificats', 'statistiques', 'acceuil', 'responsable-technique', 'user-management'],
  'acceuil': ['dossiers', 'acceuil'],
  'inspecteur': ['inspections', 'dossiers'],
  'analyste': ['statistiques', 'dossiers'],
  'chef_mission': ['inspections', 'dossiers'],
  'directeur': ['dossiers', 'certificats', 'statistiques', 'resultats'],
  'responsable_technique': ['dossiers', 'responsable-technique', 'inspections'],
  'certificats': ['certificats', 'dossiers', 'resultats'],
  'directeur_general': ['dossiers', 'inspections', 'certificats', 'statistiques', 'acceuil', 'responsable-technique'],
  'gestionnaire': ['dossiers', 'inspections'],
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Load users from localStorage if available
    const storedUsers = localStorage.getItem('certif_users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      // Initialize with default users if no users are stored
      setUsers(INITIAL_MOCK_USERS);
      localStorage.setItem('certif_users', JSON.stringify(INITIAL_MOCK_USERS));
    }

    // Check if user is already logged in
    const storedUser = localStorage.getItem('certif_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Get the latest users from localStorage
    const storedUsers = localStorage.getItem('certif_users');
    const currentUsers = storedUsers ? JSON.parse(storedUsers) : INITIAL_MOCK_USERS;
    
    const user = currentUsers.find((user: User) => user.email === email);
    
    // Simulate a delay for the "API call"
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (user && password === 'password') { // Simple password for demo
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('certif_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('certif_user');
  };

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!currentUser) return false;
    
    if (Array.isArray(role)) {
      return role.includes(currentUser.role as UserRole) || currentUser.role === 'admin' || currentUser.role === 'directeur_general';
    }
    return currentUser.role === role || currentUser.role === 'admin' || currentUser.role === 'directeur_general';
  };

  const hasAccess = (module: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin' || currentUser.role === 'directeur_general') return true;
    
    const allowedModules = ROLE_ACCESS_MAP[currentUser.role] || [];
    return allowedModules.includes(module);
  };

  const createUser = async (userData: Omit<User, "id">): Promise<boolean> => {
    // Simulate a delay for API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const newUser = { 
      ...userData, 
      id: (users.length + 1).toString(),
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('certif_users', JSON.stringify(updatedUsers));
    
    return true;
  };

  const getAllUsers = (): User[] => {
    return users;
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      isAuthenticated, 
      login, 
      logout, 
      hasRole, 
      hasAccess, 
      createUser,
      getAllUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
