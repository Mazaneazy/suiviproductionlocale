
import { User, UserRole, UserAction, Dossier } from '@/types';
import { supabase } from '@/lib/supabase';
import { generateId } from '../data/utils';
import { adaptUserForSupabase, transformSupabaseUser, addUserAction, getPermissionsForRole } from './utils';

/**
 * Log in a user with email and password
 */
export const loginUser = async (email: string, password: string): Promise<{success: boolean; userId?: string}> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Login error:', error.message);
      return { success: false };
    }
    
    // Add login action to user history
    addUserAction(data.user.id, 'Connexion', 'Connexion réussie', 'auth');
    return { success: true, userId: data.user.id };
    
  } catch (error) {
    console.error('Login exception:', error);
    return { success: false };
  }
};

/**
 * Log out the current user
 */
export const logoutUser = async (userId?: string): Promise<void> => {
  if (userId) {
    // Add logout action
    addUserAction(userId, 'Déconnexion', 'Déconnexion réussie', 'auth');
  }
  
  await supabase.auth.signOut();
};

/**
 * Get all users from Supabase
 */
export const getAllUsersService = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*');
  
  if (error) {
    console.error('Error getting users:', error);
    return [];
  }
  
  return data.map(transformSupabaseUser);
};

/**
 * Get user by ID from Supabase
 */
export const getUserByIdService = async (id: string): Promise<User | undefined> => {
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

/**
 * Create a new user
 */
export const createUserService = async (user: Omit<User, 'id'>): Promise<boolean> => {
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

/**
 * Change user password
 */
export const changePasswordService = async (userId: string, currentPassword: string, newPassword: string): Promise<boolean> => {
  try {
    // First verify the current password by trying to sign in
    // This requires knowing the user's email
    const user = await getUserByIdService(userId);
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

/**
 * Request password reset email
 */
export const resetPasswordService = async (email: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    
    if (error) {
      console.error('Error sending reset password email:', error);
      return false;
    }
    
    return true;
    
  } catch (error) {
    console.error('Error in resetPassword:', error);
    return false;
  }
};

/**
 * Get user actions from Supabase
 */
export const getUserActionsService = async (userId: string): Promise<UserAction[]> => {
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

/**
 * Create async producteur account
 */
export const createProducteurAccountAsync = async (user: User, dossier: Dossier) => {
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

/**
 * Create producteur account in Supabase
 */
export const createProducteurAccountService = (dossier: Dossier): User => {
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

// Function to get current session
export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  
  return session;
};

// Get user profile data
export const getUserProfile = async (userId: string) => {
  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
  
  return profile;
};
