
import React, { createContext, useState, useEffect } from 'react';
import { User, UserRole, Dossier } from '@/types';
import { supabase } from '@/lib/supabase';
import { generateId } from './data/utils';
import { AuthContextProps } from './AuthContextTypes';
import { rolePermissionsMap, moduleNames } from '@/constants/authConstants';

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
    const getSession = async () => {
      setLoading(true);
      
      // Get current session from Supabase
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        setLoading(false);
        return;
      }
      
      if (session) {
        // If we have a session, get the user profile data
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          console.error('Error getting user profile:', profileError);
        } else if (profile) {
          // Set current user with merged data
          setCurrentUser({
            id: session.user.id,
            email: session.user.email || '',
            name: profile.name || session.user.email?.split('@')[0] || '',
            role: profile.role || 'acceuil',
            permissions: profile.permissions || [],
            actions: profile.actions || [],
            dateCreation: profile.dateCreation || new Date().toISOString(),
          });
        }
      }
      
      setLoading(false);
    };
    
    getSession();
    
    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Get user profile data when signed in
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            setCurrentUser({
              id: session.user.id,
              email: session.user.email || '',
              name: profile.name || session.user.email?.split('@')[0] || '',
              role: profile.role || 'acceuil',
              permissions: profile.permissions || [],
              actions: profile.actions || [],
              dateCreation: profile.dateCreation || new Date().toISOString(),
            });
          } else {
            // Create profile if it doesn't exist
            const newProfile = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.email?.split('@')[0] || '',
              role: 'acceuil',
              permissions: rolePermissionsMap.acceuil || [],
              actions: [],
              dateCreation: new Date().toISOString(),
            };
            
            await supabase.from('users').insert(newProfile);
            setCurrentUser(newProfile);
          }
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function - use Supabase auth
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error.message);
        return false;
      }
      
      // Add login action to user history
      addUserAction(data.user.id, 'Connexion', 'Connexion réussie', 'auth');
      return true;
      
    } catch (error) {
      console.error('Login exception:', error);
      return false;
    }
  };

  // Logout function - use Supabase auth
  const logout = async () => {
    if (currentUser) {
      // Add logout action
      addUserAction(currentUser.id, 'Déconnexion', 'Déconnexion réussie', 'auth');
    }
    
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  // Get all users from Supabase
  const getAllUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) {
      console.error('Error getting users:', error);
      return [];
    }
    
    return data as User[];
  };

  // Get user by ID from Supabase
  const getUserById = async (id: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
    
    return data as User;
  };

  // Helper to get permissions based on role
  const getPermissionsForRole = (role: UserRole): string[] => {
    return rolePermissionsMap[role] || [];
  };

  // Create user with automatic permissions based on role
  const createUser = async (user: Omit<User, 'id'>) => {
    try {
      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password || 'password', // Default password
        email_confirm: true
      });
      
      if (authError) {
        console.error('Error creating auth user:', authError);
        return false;
      }
      
      // Assign permissions based on role
      const permissions = getPermissionsForRole(user.role);
      
      // Create user profile
      const newUser: User = {
        id: authData.user.id,
        ...user,
        permissions,
        password: undefined, // Don't store password in profile
        actions: []
      };
      
      const { error } = await supabase
        .from('users')
        .insert(newUser);
      
      if (error) {
        console.error('Error creating user profile:', error);
        return false;
      }
      
      // Add creation action
      addUserAction(newUser.id, 'Création de compte', `Compte créé avec le rôle ${newUser.role}`, 'user-management');
      return true;
      
    } catch (error) {
      console.error('Error in createUser:', error);
      return false;
    }
  };
  
  // Change password function
  const changePassword = async (userId: string, currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      // First verify the current password by trying to sign in
      // This requires knowing the user's email
      const user = await getUserById(userId);
      if (!user?.email) return false;
      
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      });
      
      if (signInError) {
        // Current password is incorrect
        return false;
      }
      
      // Update the password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        console.error('Error updating password:', error);
        return false;
      }
      
      // Add password change action
      addUserAction(userId, 'Modification mot de passe', 'Mot de passe modifié', 'auth');
      return true;
      
    } catch (error) {
      console.error('Error in changePassword:', error);
      return false;
    }
  };

  // Password reset function
  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      
      if (error) {
        console.error('Error sending reset password email:', error);
        return false;
      }
      
      // We don't know the user ID here since we're just using the email
      // So we can't add a user action
      return true;
      
    } catch (error) {
      console.error('Error in resetPassword:', error);
      return false;
    }
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

  // Add user action to Supabase
  const addUserAction = async (userId: string, action: string, details: string, module: string) => {
    const newAction = {
      id: generateId(),
      userId: userId,
      date: new Date().toISOString(),
      action: action,
      details: details,
      module: module
    };
    
    const { error } = await supabase
      .from('user_actions')
      .insert(newAction);
    
    if (error) {
      console.error('Error adding user action:', error);
    }
  };

  // Get user actions from Supabase
  const getUserActions = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_actions')
      .select('*')
      .eq('userId', userId);
    
    if (error) {
      console.error('Error getting user actions:', error);
      return [];
    }
    
    return data;
  };

  // Create producteur account in Supabase
  const createProducteurAccount = async (dossier: Dossier) => {
    try {
      // Generate an email for the producteur
      const email = `${dossier.operateurNom.toLowerCase().replace(/\s+/g, '.')}@producteur.anor.cm`;
      const password = 'password'; // Default password
      
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });
      
      if (authError) {
        console.error('Error creating auth user for producteur:', authError);
        throw authError;
      }
      
      // Create user profile
      const newUser: User = {
        id: authData.user.id,
        name: dossier.operateurNom,
        email,
        role: 'producteur',
        producteurDossierId: dossier.id,
        permissions: ['dashboard'],
        actions: [],
        dateCreation: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('users')
        .insert(newUser);
      
      if (error) {
        console.error('Error creating producteur profile:', error);
        throw error;
      }
      
      return newUser;
    } catch (error) {
      console.error('Error in createProducteurAccount:', error);
      throw error;
    }
  };

  const isAuthenticated = currentUser !== null;

  // For backward compatibility, we implement the old function signatures as wrappers
  // around the async functions
  const syncGetAllUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    
    useEffect(() => {
      getAllUsers().then(setUsers);
    }, []);
    
    return users;
  };
  
  const syncGetUserById = (id: string) => {
    const [user, setUser] = useState<User | undefined>(undefined);
    
    useEffect(() => {
      getUserById(id).then(setUser);
    }, [id]);
    
    return user;
  };
  
  const syncGetUserActions = (userId: string) => {
    const [actions, setActions] = useState<any[]>([]);
    
    useEffect(() => {
      getUserActions(userId).then(setActions);
    }, [userId]);
    
    return actions;
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      login,
      logout,
      getAllUsers: syncGetAllUsers,
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

// Export the useAuth hook directly from this file
export { useAuth } from '../hooks/useAuth';
