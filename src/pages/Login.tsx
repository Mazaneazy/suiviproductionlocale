
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { DEMO_USERS } from '@/contexts/data/mockData';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showDemoUsers, setShowDemoUsers] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
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
      await login(demoEmail, demoPassword);
      navigate('/dashboard');
    } catch (err) {
      setError('Échec de connexion avec le compte démo. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg shadow-md bg-white p-8">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/e1bf7151-3abe-4c2a-8037-71e791d77bf9.png" 
            alt="ANOR Logo" 
            className="h-16 mx-auto mb-4" 
          />
          <h1 className="text-2xl font-bold text-gray-800">
            ANOR Certification
          </h1>
          <p className="text-gray-500 mt-2">
            Système de gestion des certifications
          </p>
        </div>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="info">Informations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Mot de passe
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-certif-blue hover:bg-certif-blue/90"
                disabled={isLoading}
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
              
              <div className="text-center mt-4">
                <Button 
                  type="button" 
                  variant="link" 
                  onClick={() => setShowDemoUsers(!showDemoUsers)}
                  size="sm"
                >
                  {showDemoUsers ? 'Masquer les comptes démo' : 'Afficher les comptes démo'}
                </Button>
              </div>
              
              {showDemoUsers && (
                <div className="mt-4 border rounded p-3 bg-gray-50">
                  <h3 className="font-medium mb-2 text-sm">Comptes de démonstration:</h3>
                  <ul className="space-y-2">
                    {DEMO_USERS.map(user => (
                      <li key={user.id} className="text-xs">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="w-full justify-between text-left py-1 px-2 h-auto"
                          onClick={() => handleDemoUserLogin(user.email, user.password)}
                        >
                          <span className="flex flex-col items-start">
                            <span className="font-medium">{user.email}</span>
                            <span className="text-gray-500 text-xs">({user.role})</span>
                          </span>
                          <span className="bg-gray-200 px-2 py-0.5 rounded text-gray-700">
                            Connexion rapide
                          </span>
                        </Button>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-500 mt-3">
                    Cliquez sur un compte pour vous connecter automatiquement.
                  </p>
                </div>
              )}
            </form>
          </TabsContent>
          
          <TabsContent value="info">
            <Alert className="bg-blue-50 mb-4">
              <InfoIcon className="h-4 w-4 text-blue-700" />
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
              
              <p className="text-sm text-gray-500 mt-4">
                Pour vous connecter, utilisez l'un des comptes de démonstration disponibles dans l'onglet "Connexion".
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
