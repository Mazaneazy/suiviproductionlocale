
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldX } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../hooks/useAuth';

const Unauthorized = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <ShieldX size={48} className="text-red-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h1>
        <p className="text-gray-600 mb-6">
          Vous n'avez pas les autorisations nécessaires pour accéder à cette page.
          {currentUser && (
            <span className="block mt-2">
              Vous êtes connecté en tant que <strong>{currentUser.name}</strong> avec le rôle de <strong>{currentUser.role}</strong>.
            </span>
          )}
        </p>
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link to="/dashboard">Retour au tableau de bord</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
