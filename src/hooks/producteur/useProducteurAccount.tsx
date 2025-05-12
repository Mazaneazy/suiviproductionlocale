
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Dossier } from '@/types';
import { ProducteurCredentials, ProducteurAccountHook } from './types';
import { createProducteurFromDossier } from './producteurUtils';

export function useProducteurAccount(): ProducteurAccountHook {
  const { createProducteurAccount } = useAuth();
  const { toast } = useToast();
  const [createAccount, setCreateAccount] = useState(false);
  const [producteurCredentials, setProducteurCredentials] = useState<ProducteurCredentials | null>(null);

  const handleAccountCreationToggle = () => {
    setCreateAccount(!createAccount);
  };

  const createProducteurAccountFromDossier = (dossier?: Dossier): boolean => {
    if (!createAccount || !dossier) return false;
    
    const result = createProducteurFromDossier(
      dossier,
      createProducteurAccount,
      toast
    );
    
    if (result.success && result.producteur) {
      setProducteurCredentials({
        email: result.producteur.email,
        password: 'password' // Default password
      });
      return true;
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
