
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileCheck, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../components/ui/form";
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/use-toast';
import ResetPasswordDialog from '@/components/auth/ResetPasswordDialog';

// Définition du schéma de validation
const loginSchema = z.object({
  email: z.string()
    .email('Adresse email invalide')
    .min(1, 'L\'email est requis'),
  password: z.string()
    .min(1, 'Le mot de passe est requis'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const navigate = useNavigate();
  const { login, getAllUsers } = useAuth();
  const { toast } = useToast();

  // Initialisation du formulaire avec React Hook Form et Zod
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = async (values: LoginFormValues) => {
    setError('');
    setIsLoading(true);

    try {
      const success = await login(values.email, values.password);
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

  // Toggle d'affichage du mot de passe
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Get all available users for demo
  const users = getAllUsers();
  
  // Create login examples from users
  const loginExamples = users.map(user => ({
    role: user.name,
    email: user.email,
  }));

  const handleExampleLogin = (exampleEmail: string) => {
    form.setValue('email', exampleEmail);
    form.setValue('password', 'password');
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

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative">
                        <Mail className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input 
                            placeholder="Adresse email"
                            className="pl-10" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative">
                        <Lock className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input 
                            type={showPassword ? "text" : "password"}
                            placeholder="Mot de passe" 
                            className="pl-10 pr-10"
                            {...field} 
                          />
                        </FormControl>
                        <button 
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    variant="link" 
                    className="p-0 h-auto text-certif-blue"
                    onClick={() => setResetPasswordOpen(true)}
                  >
                    Mot de passe oublié ?
                  </Button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-certif-blue hover:bg-certif-blue/90" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                </Button>
              </form>
            </Form>
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

      <ResetPasswordDialog 
        open={resetPasswordOpen}
        onOpenChange={setResetPasswordOpen}
      />
    </div>
  );
};

export default Login;
