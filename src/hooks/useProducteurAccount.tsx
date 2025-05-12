
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

  const createProducteurAccountFromDossier = (dossier?: Dossier) => {
    if (!createAccount || !dossier) return false;
    
    try {
      const producteur = createProducteurAccount(dossier);
      
      if (producteur) {
        setProducteurCredentials({
          email: producteur.email,
          password: 'password' // Default password
        });
        
        toast({
          title: "Compte créé",
          description: `Un compte producteur a été créé pour ${dossier.operateurNom}`,
        });
        
        return true;
      }
    } catch (error) {
      console.error("Erreur lors de la création du compte producteur:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le compte producteur",
        variant: "destructive",
      });
    }
    
    setCreateAccount(false);
    return false;
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
