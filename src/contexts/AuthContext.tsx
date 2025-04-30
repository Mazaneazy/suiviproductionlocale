import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextProps {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  hasAccess: (module: string) => boolean;
}

const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  hasRole: () => false,
  hasAccess: () => false,
});

// Mock users for demo purposes
const MOCK_USERS: User[] = [
  { id: '1', name: 'Admin', email: 'admin@certif.com', role: 'admin', avatar: '' },
  { id: '2', name: 'Acceuil', email: 'acceuil@certif.com', role: 'acceuil', avatar: '' },
  { id: '3', name: 'Inspecteur', email: 'inspecteur@certif.com', role: 'inspecteur', avatar: '' },
  { id: '4', name: 'Comptable', email: 'comptable@certif.com', role: 'comptable', avatar: '' },
  { id: '5', name: 'Analyste', email: 'analyste@certif.com', role: 'analyste', avatar: '' },
  { id: '6', name: 'Surveillant', email: 'surveillant@certif.com', role: 'surveillant', avatar: '' },
  { id: '7', name: 'Directeur', email: 'directeur@certif.com', role: 'directeur', avatar: '' },
  { id: '8', name: 'Responsable Technique', email: 'technique@certif.com', role: 'responsable_technique', avatar: '' },
  { id: '9', name: 'Chef de Mission', email: 'chef_mission@certif.com', role: 'chef_mission', avatar: '' },
];

// Définir les accès par module pour chaque rôle
const ROLE_ACCESS_MAP: Record<string, string[]> = {
  'admin': ['dossiers', 'notes-frais', 'inspections', 'certificats', 'statistiques', 'acceuil', 'responsable-technique'],
  'acceuil': ['dossiers', 'acceuil'],
  'comptable': ['notes-frais'],
  'inspecteur': ['inspections', 'notes-frais'],
  'analyste': ['dossiers', 'inspections'],
  'surveillant': ['inspections'],
  'directeur': ['dossiers', 'notes-frais', 'certificats', 'statistiques'],
  'responsable_technique': ['dossiers', 'notes-frais', 'responsable-technique'],
  'chef_mission': ['dossiers', 'inspections'],
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('certif_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    const user = MOCK_USERS.find(user => user.email === email);
    
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
      return role.includes(currentUser.role as UserRole) || currentUser.role === 'admin';
    }
    return currentUser.role === role || currentUser.role === 'admin';
  };

  const hasAccess = (module: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    
    const allowedModules = ROLE_ACCESS_MAP[currentUser.role] || [];
    return allowedModules.includes(module);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, logout, hasRole, hasAccess }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
