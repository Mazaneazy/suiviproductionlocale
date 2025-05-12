
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const supabaseConfigured = isSupabaseConfigured();

  useEffect(() => {
    // Only navigate if Supabase is properly configured
    if (supabaseConfigured) {
      if (isAuthenticated) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    }
  }, [isAuthenticated, navigate, supabaseConfigured]);

  // If Supabase is not configured, show a helpful message
  if (!supabaseConfigured) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl text-center space-y-6">
          <h1 className="text-3xl font-bold text-red-600">Configuration Required</h1>
          <p className="text-xl">
            Your application needs to be connected to Supabase for authentication and data storage.
          </p>
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-md text-left">
            <h2 className="font-bold text-lg mb-2">How to connect to Supabase:</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Click on the green Supabase button in the top right corner</li>
              <li>Follow the steps to connect your Lovable project to Supabase</li>
              <li>Once connected, the necessary environment variables will be available</li>
            </ol>
          </div>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md"
            onClick={() => window.location.reload()}
          >
            Refresh page after connecting
          </Button>
        </div>
      </div>
    );
  }

  // Default loading screen when navigating
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Redirection en cours...</h1>
      </div>
    </div>
  );
};

export default Index;
