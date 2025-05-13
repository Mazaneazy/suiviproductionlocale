
import React, { createContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { AuthContextProps } from './types';
import { 
  loginUser, 
  logoutUser, 
  createUserService, 
  changePasswordService, 
  resetPasswordService, 
  createProducteurAccountService 
} from './authService';
import { 
  useGetAllUsers, 
  useGetUserById, 
  useGetUserActions 
} from './useAuthHooks';
import { 
  setupAuthStateListener, 
  initializeAuthState 
} from './authStateHandler';

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
  changePassword: async () => false,
});

// Export module names for use in other components
export { moduleNames } from '@/constants/authConstants';

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    // Initialize auth state
    initializeAuthState(setCurrentUser, setLoading);
    
    // Set up auth state listener
    const subscription = setupAuthStateListener(setCurrentUser);
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function - use Supabase auth
  const login = async (email: string, password: string) => {
    const result = await loginUser(email, password);
    return result.success;
  };

  // Logout function - use Supabase auth
  const logout = async () => {
    await logoutUser(currentUser?.id);
    setCurrentUser(null);
  };

  // Create user with automatic permissions based on role
  const createUser = async (user: Omit<User, 'id'>) => {
    return createUserService(user);
  };
  
  // Change password function
  const changePassword = async (userId: string, currentPassword: string, newPassword: string): Promise<boolean> => {
    return changePasswordService(userId, currentPassword, newPassword);
  };

  // Password reset function
  const resetPassword = async (email: string): Promise<boolean> => {
    return resetPasswordService(email);
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

  // Create producteur account in Supabase
  const createProducteurAccount = (dossier: any): User => {
    return createProducteurAccountService(dossier);
  };

  const isAuthenticated = currentUser !== null;

  // For backward compatibility, we implement the old function signatures as wrappers
  const syncGetAllUsers = useGetAllUsers();
  
  const syncGetUserById = (id: string) => {
    return useGetUserById(id);
  };
  
  const syncGetUserActions = (userId: string) => {
    return useGetUserActions(userId);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      login,
      logout,
      getAllUsers: () => syncGetAllUsers,
      getUserById: syncGetUserById,
      createUser,
      hasAccess,
      hasRole,
      isAuthenticated,
      getUserActions: syncGetUserActions,
      createProducteurAccount,
      resetPassword,
      changePassword
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
