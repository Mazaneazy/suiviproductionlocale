
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { DEMO_USERS } from '@/contexts/data/mockData';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Utilise la fonction login de useAuth qui fait appel à supabase.auth
      const success = await login(email, password);
      if (success) {
        toast.success('Connexion réussie');
        navigate('/dashboard');
      } else {
        throw new Error('Échec de la connexion');
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError('Identifiants incorrects. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoUserLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setIsLoading(true);
    
    try {
      // Utilise la fonction login de useAuth qui fait appel à supabase.auth
      const success = await login(demoEmail, demoPassword);
      if (success) {
        toast.success('Connexion réussie avec compte démo');
        navigate('/dashboard');
      } else {
        throw new Error('Échec de la connexion avec compte démo');
      }
    } catch (err) {
      console.error('Erreur de connexion démo:', err);
      setError('Échec de connexion avec le compte démo. Veuillez réessayer.');
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
          <div className="text-center mb-8">
            <img 
              src="/lovable-uploads/e1bf7151-3abe-4c2a-8037-71e791d77bf9.png" 
              alt="ANOR Logo" 
              className="h-16 mx-auto mb-4" 
              loading="eager"
              width="64"
              height="64"
            />
            <h1 className="text-2xl font-bold text-gray-800">
              ANOR Certification
            </h1>
            <p className="text-gray-500 mt-2">
              Système de gestion des certifications
            </p>
          </div>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8" role="tablist" aria-label="Options de connexion">
              <TabsTrigger value="login" role="tab">Connexion</TabsTrigger>
              <TabsTrigger value="info" role="tab">Informations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" role="tabpanel">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm" role="alert" aria-live="assertive">
                    {error}
                  </div>
                )}
                <div>
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    required
                    aria-required="true"
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="text-sm font-medium text-gray-700 block mb-2">
                    Mot de passe
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    aria-required="true"
                    autoComplete="current-password"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-certif-blue hover:bg-certif-blue/90 focus:ring-2 focus:ring-certif-blue/50 focus:outline-none"
                  disabled={isLoading}
                  aria-busy={isLoading}
                >
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </Button>
                
                <div className="text-center mt-4 space-y-2">
                  <Button 
                    type="button" 
                    variant="link" 
                    onClick={() => setShowDemoUsers(!showDemoUsers)}
                    size="sm"
                    aria-expanded={showDemoUsers}
                    aria-controls="demo-accounts"
                  >
                    {showDemoUsers ? 'Masquer les comptes démo' : 'Afficher les comptes démo'}
                  </Button>
                </div>
                
                {showDemoUsers && (
                  <div id="demo-accounts" className="mt-4 border rounded p-3 bg-gray-50">
                    <h3 className="font-medium mb-2 text-sm">Comptes de démonstration:</h3>
                    
                    {supabaseUsers.length > 0 && (
                      <>
                        <div className="mb-3">
                          <h4 className="text-xs font-semibold text-gray-600 mb-1">Comptes Supabase:</h4>
                          <ul className="space-y-2" role="list">
                            {supabaseUsers.map((user, index) => (
                              <li key={index} className="text-xs">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="w-full justify-between text-left py-1 px-2 h-auto"
                                  onClick={() => handleSupabaseUserLogin(user.email)}
                                  aria-label={`Se connecter en tant que ${user.email} (${user.role})`}
                                >
                                  <span className="flex flex-col items-start">
                                    <span className="font-medium">{user.email}</span>
                                    <span className="text-gray-500 text-xs">({user.role})</span>
                                  </span>
                                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">
                                    Compte Supabase
                                  </span>
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="border-t my-3"></div>
                      </>
                    )}
                    
                    <h4 className="text-xs font-semibold text-gray-600 mb-1">Comptes intégrés à l'application:</h4>
                    <ul className="space-y-2" role="list">
                      {DEMO_USERS.map(user => (
                        <li key={user.id} className="text-xs">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="w-full justify-between text-left py-1 px-2 h-auto"
                            onClick={() => handleDemoUserLogin(user.email, user.password)}
                            aria-label={`Se connecter en tant que ${user.email} (${user.role})`}
                          >
                            <span className="flex flex-col items-start">
                              <span className="font-medium">{user.email}</span>
                              <span className="text-gray-500 text-xs">({user.role})</span>
                            </span>
                            <span className="bg-gray-200 px-2 py-0.5 rounded text-gray-700 text-xs">
                              Connexion rapide
                            </span>
                          </Button>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-100 text-xs">
                      <p className="text-blue-800 font-medium">Utilisateurs Supabase disponibles:</p>
                      <p className="text-blue-700 mt-1">• <strong>admin@anor.cm</strong> - mot de passe: password</p>
                      <p className="text-blue-700">• <strong>directeur@anor.cm</strong> - mot de passe: password</p>
                      <p className="text-blue-700">• <strong>inspecteur@anor.cm</strong> - mot de passe: password</p>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-3">
                      Cliquez sur un compte pour vous connecter automatiquement.
                    </p>
                  </div>
                )}
              </form>
            </TabsContent>
            
            <TabsContent value="info" role="tabpanel">
              <Alert className="bg-blue-50 mb-4">
                <InfoIcon className="h-4 w-4 text-blue-700" aria-hidden="true" />
                <AlertTitle className="text-blue-700">Information</AlertTitle>
                <AlertDescription className="text-blue-600">
                  Cette application est une démonstration du système de gestion des certifications ANOR.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4 text-sm">
                <p className="mb-2">
                  Ce système permet la gestion des dossiers de certification, des inspections, des notes de frais et la génération des certificats de conformité.
                </p>
                
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Fonctionnalités principales:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Gestion des dossiers de demande</li>
                    <li>Planification et suivi des inspections</li>
                    <li>Gestion des notes de frais</li>
                    <li>Génération des certificats</li>
                    <li>Statistiques et tableaux de bord</li>
                  </ul>
                </div>
                
                <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-md">
                  <h3 className="font-medium text-amber-800 mb-1">Comptes d'accès:</h3>
                  <p className="text-amber-700 mb-2">
                    Vous pouvez vous connecter avec les comptes listés dans l'onglet "Connexion".
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-amber-700">
                    <li><strong>Admin:</strong> admin@anor.cm / password</li>
                    <li><strong>Directeur:</strong> directeur@anor.cm / password</li>
                    <li><strong>Inspecteur:</strong> inspecteur@anor.cm / password</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Login;
