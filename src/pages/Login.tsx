
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileCheck, Mail, Lock, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, getAllUsers } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans le système de certification des produits locaux.",
        });
        navigate('/dashboard');
      } else {
        setError('Email ou mot de passe incorrect');
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  // Get all available users for demo
  const users = getAllUsers();
  
  // Create login examples from users
  const loginExamples = users.map(user => ({
    role: user.name,
    email: user.email,
  }));

  const handleExampleLogin = (exampleEmail: string) => {
    setEmail(exampleEmail);
    setPassword('password');
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4" 
         style={{ backgroundImage: `url('/lovable-uploads/e93b38b9-1b6c-44f8-b92e-16075ea91ea2.png')` }}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="/lovable-uploads/b3a4f946-cb80-4ff5-9096-718b92e2e94a.png" alt="Logo ANOR" className="h-24" />
          </div>
          <h1 className="text-3xl font-bold text-white">Certification des Produits Locaux</h1>
          <p className="text-white/80 mt-2">Système de gestion des certifications - ANOR</p>
        </div>

        <Card className="backdrop-blur-md bg-white/90">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-center">Connexion</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                  <Input 
                    type="email"
                    placeholder="Adresse email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                  <Input 
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-certif-blue hover:bg-certif-blue/90" 
                disabled={isLoading}
              >
                {isLoading ? 'Connexion en cours...' : 'Se connecter'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="w-full border-t pt-4">
              <p className="text-sm text-gray-500 mb-2">Pour la démonstration, utilisez:</p>
              <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                {loginExamples.map((example) => (
                  <Button 
                    key={example.role}
                    variant="outline" 
                    onClick={() => handleExampleLogin(example.email)}
                    className="text-xs justify-between"
                    size="sm"
                  >
                    <span className="font-semibold">{example.role}</span>
                    <span className="text-gray-500 truncate max-w-[150px]">{example.email}</span>
                  </Button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">Mot de passe: "password"</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
