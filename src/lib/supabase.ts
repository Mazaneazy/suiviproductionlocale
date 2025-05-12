
import { createClient } from '@supabase/supabase-js';
import { supabase as integrationsSupabase } from '@/integrations/supabase/client';

// Export the client from integrations directly - this is the preferred approach
export const supabase = integrationsSupabase;

// Re-export the helper functions using the integrated client
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
      return null;
    }
    return data.session.user;
  } catch (err) {
    console.error('Error getting current user:', err);
    return null;
  }
};

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  // Since we are now using the integration client, it's always configured
  return true;
};
