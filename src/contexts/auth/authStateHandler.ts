
import { Dispatch, SetStateAction } from 'react';
import { User } from '@/types';
import { supabase } from '@/lib/supabase';
import { transformSupabaseUser } from './utils';
import { getUserProfile } from './authService';

/**
 * Set up the auth state listener
 */
export const setupAuthStateListener = (
  setCurrentUser: Dispatch<SetStateAction<User | null>>
) => {
  // Set up auth listener
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Get user profile data when signed in
        const profile = await getUserProfile(session.user.id);
        
        if (profile) {
          setCurrentUser(transformSupabaseUser(profile));
        } else {
          // Create profile if it doesn't exist
          const newProfile = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.email?.split('@')[0] || '',
            role: 'acceuil',
            permissions: ['acceuil', 'dossiers'],
            date_creation: new Date().toISOString(),
            actions: [],
            // Add these missing properties to fix TypeScript error
            modules: [],
            phone: '',
            producteur_dossier_id: null
          };
          
          await supabase.from('users').insert(newProfile);
          setCurrentUser(transformSupabaseUser(newProfile as any));
        }
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
      }
    }
  );
  
  return subscription;
};

/**
 * Initialize the auth state by checking for an existing session
 */
export const initializeAuthState = async (
  setCurrentUser: Dispatch<SetStateAction<User | null>>,
  setLoading: Dispatch<SetStateAction<boolean>>
) => {
  try {
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
      const profile = await getUserProfile(session.user.id);
      
      if (profile) {
        // Set current user with merged data
        setCurrentUser(transformSupabaseUser(profile));
      }
    }
    
    setLoading(false);
  } catch (error) {
    console.error('Error initializing auth state:', error);
    setLoading(false);
  }
};
