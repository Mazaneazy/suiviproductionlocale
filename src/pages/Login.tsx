
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet';

// Import the newly extracted components
import LoginHeader from '@/components/auth/LoginHeader';
import LoginForm from '@/components/auth/LoginForm';
import LoginInfoTab from '@/components/auth/LoginInfoTab';
import DemoUsersSection from '@/components/auth/DemoUsersSection';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showDemoUsers, setShowDemoUsers] = useState(false);
  const [supabaseUsers, setSupabaseUsers] = useState<{email: string; role: string}[]>([]);

  useEffect(() => {
    // Charger les comptes depuis Supabase
    const loadSupabaseUsers = async () => {
      try {
        // Tenter de récupérer les comptes de démo de la base de données
        const { data, error } = await supabase
          .from('demo_accounts')
          .select('email, role');
        
        if (error) {
          console.error('Erreur lors de la récupération des comptes:', error);
          return;
        }
        
        if (data && data.length > 0) {
          setSupabaseUsers(data);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des comptes:', err);
      }
    };

    loadSupabaseUsers();
  }, []);

  const handleDemoUserLogin = async (demoEmail: string, demoPassword: string) => {
    setIsLoading(true);
    
    try {
      const success = await login(demoEmail, demoPassword);
      if (success) {
        toast.success('Connexion réussie avec compte démo');
        navigate('/dashboard');
      } else {
        throw new Error('Échec de la connexion avec compte démo');
      }
    } catch (err) {
      console.error('Erreur de connexion démo:', err);
      toast.error('Échec de connexion avec le compte démo. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSupabaseUserLogin = (userEmail: string) => {
    // Pour les comptes Supabase, on utilise le mot de passe par défaut
    handleDemoUserLogin(userEmail, 'password');
  };

  return (
    <>
      <Helmet>
        <title>ANOR Certification - Connexion</title>
        <meta name="description" content="Connectez-vous au système de gestion des certifications ANOR" />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-lg shadow-md bg-white p-8">
          <LoginHeader />
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8" role="tablist" aria-label="Options de connexion">
              <TabsTrigger value="login" role="tab">Connexion</TabsTrigger>
              <TabsTrigger value="info" role="tab">Informations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" role="tabpanel">
              <LoginForm />
              <DemoUsersSection 
                showDemoUsers={showDemoUsers} 
                setShowDemoUsers={setShowDemoUsers}
                handleDemoUserLogin={handleDemoUserLogin}
                handleSupabaseUserLogin={handleSupabaseUserLogin}
                supabaseUsers={supabaseUsers}
              />
            </TabsContent>
            
            <TabsContent value="info" role="tabpanel">
              <LoginInfoTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Login;
