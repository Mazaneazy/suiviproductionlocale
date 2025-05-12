
import { UserRole } from '@/types';
import { rolePermissionsMap } from '@/constants/authConstants';
import { generateId } from '../data/utils';
import { supabase } from '@/lib/supabase';
import { Database } from '@/integrations/supabase/types';

// Helper to get permissions based on role
export const getPermissionsForRole = (role: UserRole): string[] => {
  return rolePermissionsMap[role] || [];
};

// Add user action to Supabase
export const addUserAction = async (userId: string, action: string, details: string, module: string) => {
  const newAction = {
    id: generateId(),
    user_id: userId,
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

// Transform the Supabase user profile into our User type
export const transformSupabaseUser = (profile: Database['public']['Tables']['users']['Row']): User => {
  return {
    id: profile.id,
    email: profile.email,
    name: profile.name || profile.email?.split('@')[0] || '',
    role: profile.role as UserRole,
    permissions: profile.permissions || [],
    actions: Array.isArray(profile.actions) ? profile.actions.map(transformJsonToUserAction) : [],
    dateCreation: profile.date_creation || new Date().toISOString(),
    phone: profile.phone,
    modules: profile.modules,
    producteurDossierId: profile.producteur_dossier_id
  };
};

// Transform JSON to UserAction
const transformJsonToUserAction = (action: any): UserAction => {
  return {
    id: action.id || generateId(),
    userId: action.user_id || action.userId,
    action: action.action,
    date: action.date,
    details: action.details,
    module: action.module
  };
};

// Utility to adapt our User type to Supabase format
export const adaptUserForSupabase = (user: Omit<User, 'id'> | User) => {
  return {
    id: 'id' in user ? user.id : undefined,
    email: user.email,
    name: user.name,
    role: user.role,
    permissions: user.permissions || [],
    actions: [],
    date_creation: user.dateCreation || new Date().toISOString(),
    phone: user.phone,
    modules: user.modules || [],
    producteur_dossier_id: user.producteurDossierId
  };
};
