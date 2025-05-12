
import { createClient } from '@supabase/supabase-js';

// Get the environment variables from Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Ensure the environment variables are defined
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Supabase URL and/or Anon Key are missing. Make sure to connect your project to Supabase.'
  );
}

// Initialize the Supabase client
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Helper functions for common Supabase operations
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) {
    return null;
  }
  return data.session.user;
};
