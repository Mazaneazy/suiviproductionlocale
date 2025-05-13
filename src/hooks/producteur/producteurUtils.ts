
import { User, Dossier } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const createProducteurFromDossier = (
  dossier: Dossier,
  createProducteurAccount: (dossier: Dossier) => User,
  toast: ReturnType<typeof useToast>['toast']
): { success: boolean; producteur: User | null } => {
  try {
    const producteur = createProducteurAccount(dossier);
    
    if (producteur) {
      toast({
        title: "Compte créé",
        description: `Un compte producteur a été créé pour ${dossier.operateurNom}`,
      });
      
      return {
        success: true,
        producteur
      };
    }
  } catch (error) {
    console.error("Erreur lors de la création du compte producteur:", error);
    toast({
      title: "Erreur",
      description: "Impossible de créer le compte producteur",
      variant: "destructive",
    });
  }
  
  return {
    success: false,
    producteur: null
  };
};
