
import React, { createContext, useState, useEffect } from 'react';
import { User, UserRole, UserAction, Dossier } from '@/types';
import { supabase } from '@/lib/supabase';
import { generateId } from '../data/utils';
import { AuthContextProps } from './types';
import { getPermissionsForRole, addUserAction, transformSupabaseUser, adaptUserForSupabase } from './utils';

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
          setCurrentUser(transformSupabaseUser(profile));
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
            setCurrentUser(transformSupabaseUser(profile));
          } else {
            // Create profile if it doesn't exist
            const newProfile = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.email?.split('@')[0] || '',
              role: 'acceuil' as UserRole,
              permissions: getPermissionsForRole('acceuil'),
              date_creation: new Date().toISOString(),
              actions: []
            };
            
            await supabase.from('users').insert(newProfile);
            setCurrentUser(transformSupabaseUser(newProfile));
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
    
    return data.map(transformSupabaseUser);
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
    
    return transformSupabaseUser(data);
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
      const newUser = {
        ...adaptUserForSupabase(user),
        id: authData.user.id,
        permissions,
      };
      
      const { error } = await supabase
        .from('users')
        .insert(newUser);
      
      if (error) {
        console.error('Error creating user profile:', error);
        return false;
      }
      
      // Add creation action
      addUserAction(authData.user.id, 'Création de compte', `Compte créé avec le rôle ${user.role}`, 'user-management');
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

  // Get user actions from Supabase
  const getUserActions = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_actions')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error getting user actions:', error);
      return [];
    }
    
    return data.map(action => ({
      id: action.id,
      userId: action.user_id,
      action: action.action,
      date: action.date,
      details: action.details || '',
      module: action.module || '',
    }));
  };

  // Create producteur account in Supabase
  // Fix: Change to a synchronous function with immediate return
  const createProducteurAccount = (dossier: Dossier): User => {
    try {
      // Generate data for the producteur
      const email = `${dossier.operateurNom.toLowerCase().replace(/\s+/g, '.')}@producteur.anor.cm`;
      
      // Create a synthetic user without actually creating it in the database yet
      // This maintains the synchronous contract while allowing the actual creation to happen asynchronously
      const newUser: User = {
        id: generateId(), // Use a temporary ID
        name: dossier.operateurNom,
        email,
        role: 'producteur' as UserRole,
        producteurDossierId: dossier.id,
        permissions: ['dashboard'],
        actions: [],
        dateCreation: new Date().toISOString()
      };
      
      // Start the async process to create the real user in the background
      // This doesn't block the synchronous return
      createProducteurAccountAsync(newUser, dossier);
      
      // Return the synthetic user immediately
      return newUser;
    } catch (error) {
      console.error('Error in createProducteurAccount:', error);
      // Return a minimal valid User object in case of error
      return {
        id: generateId(),
        name: dossier.operateurNom,
        email: 'error@producteur.anor.cm',
        role: 'producteur' as UserRole,
      };
    }
  };
  
  // Asynchronous helper to actually create the producteur account in the database
  const createProducteurAccountAsync = async (user: User, dossier: Dossier) => {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: 'password', // Default password
        email_confirm: true
      });
      
      if (authError) {
        console.error('Error creating auth user for producteur:', authError);
        return;
      }
      
      // Update with the real ID from Supabase
      const supabaseUser = adaptUserForSupabase({
        ...user,
        id: authData.user.id
      });
      
      const { error } = await supabase
        .from('users')
        .insert(supabaseUser);
      
      if (error) {
        console.error('Error creating producteur profile:', error);
      }
    } catch (error) {
      console.error('Async error in createProducteurAccountAsync:', error);
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
    const [actions, setActions] = useState<UserAction[]>([]);
    
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
