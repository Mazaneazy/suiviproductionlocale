
import React from 'react';
import { Button } from '@/components/ui/button';
import { DEMO_USERS } from '@/contexts/data/mockData';

interface DemoUsersSectionProps {
  showDemoUsers: boolean;
  setShowDemoUsers: (show: boolean) => void;
  handleDemoUserLogin: (email: string, password: string) => Promise<void>;
  handleSupabaseUserLogin: (email: string) => void;
  supabaseUsers: {email: string; role: string}[];
}

const DemoUsersSection = ({ 
  showDemoUsers, 
  setShowDemoUsers, 
  handleDemoUserLogin, 
  handleSupabaseUserLogin, 
  supabaseUsers 
}: DemoUsersSectionProps) => {
  return (
    <>
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
    </>
  );
};

export default DemoUsersSection;
