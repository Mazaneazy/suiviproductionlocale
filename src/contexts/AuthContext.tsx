
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextProps {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  hasRole: () => false,
});

// Mock users for demo purposes
const MOCK_USERS: User[] = [
  { id: '1', name: 'Admin', email: 'admin@certif.com', role: 'admin', avatar: '' },
  { id: '2', name: 'Gestionnaire', email: 'gestionnaire@certif.com', role: 'gestionnaire', avatar: '' },
  { id: '3', name: 'Inspecteur', email: 'inspecteur@certif.com', role: 'inspecteur', avatar: '' },
  { id: '4', name: 'Comptable', email: 'comptable@certif.com', role: 'comptable', avatar: '' },
  { id: '5', name: 'Certificateur', email: 'certificateur@certif.com', role: 'certificateur', avatar: '' },
];

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
      return role.includes(currentUser.role);
    }
    return currentUser.role === role || currentUser.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
