
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import LoadingIndicator from '@/components/ui/loading-indicator';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
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

  return (
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
        {isLoading ? <span className="flex items-center gap-2"><LoadingIndicator size="sm" label="Connexion en cours" /> Connexion...</span> : 'Se connecter'}
      </Button>
    </form>
  );
};

export default LoginForm;
