
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Dossier } from '@/types';

export function useProducteurAccount() {
  const { createProducteurAccount } = useAuth();
  const { toast } = useToast();
  const [createAccount, setCreateAccount] = useState(false);
  const [producteurCredentials, setProducteurCredentials] = useState<{email: string, password: string} | null>(null);

  const handleAccountCreationToggle = () => {
    setCreateAccount(!createAccount);
  };

  const createProducteurAccountFromDossier = () => {
    if (!createAccount) return false;
    
    // Le dossier est créé par la fonction onSubmit, donc on doit attendre un peu avant de créer le compte
    setTimeout(() => {
      const latestDossiers = JSON.parse(localStorage.getItem('dossiers') || '[]');
      const latestDossier = latestDossiers.length > 0 ? latestDossiers[latestDossiers.length - 1] : null;
      
      if (latestDossier) {
        const producteur = createProducteurAccount(latestDossier);
        
        if (producteur) {
          setProducteurCredentials({
            email: producteur.email,
            password: 'password'
          });
        } else {
          setCreateAccount(false);
          toast({
            title: "Erreur",
            description: "Impossible de créer le compte producteur",
            variant: "destructive",
          });
        }
      }
    }, 300);

    return true;
  };

  const resetState = () => {
    setProducteurCredentials(null);
    setCreateAccount(false);
  };

  return {
    createAccount,
    producteurCredentials,
    handleAccountCreationToggle,
    createProducteurAccountFromDossier,
    resetState
  };
}
