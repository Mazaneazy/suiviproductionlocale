
import { createClient } from '@supabase/supabase-js';

// Get the environment variables from Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is properly configured
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Supabase URL and/or Anon Key are missing. Make sure to connect your project to Supabase by clicking the green Supabase button in the top right corner and following the connection steps.'
  );
  
  // Show more detailed error information in the console to help developers
  if (!supabaseUrl) console.error('VITE_SUPABASE_URL is undefined');
  if (!supabaseAnonKey) console.error('VITE_SUPABASE_ANON_KEY is undefined');
}

// Initialize the Supabase client with fallback empty strings to prevent immediate runtime errors
// This will allow the app to load, but Supabase functionality won't work until properly configured
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co', // Fallback URL to prevent immediate crash
  supabaseAnonKey || 'placeholder-key' // Fallback key to prevent immediate crash
);

// Helper functions for common Supabase operations
export const getCurrentUser = async () => {
  // Check if Supabase is properly configured before making any API calls
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase is not properly configured. Cannot get current user.');
    return null;
  }
  
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

// Add a helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};
