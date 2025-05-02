
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dossier } from '@/types';
import DossierForm from './DossierForm';
import { useAuth } from '@/contexts/AuthContext';

interface AddDossierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newDossier: Omit<Dossier, 'id'>;
  setNewDossier: React.Dispatch<React.SetStateAction<Omit<Dossier, 'id'>>>;
  onSubmit: () => void;
}

const AddDossierDialog: React.FC<AddDossierDialogProps> = ({
  open,
  onOpenChange,
  newDossier,
  setNewDossier,
  onSubmit
}) => {
  const { toast } = useToast();
  const { createProducteurAccount } = useAuth();
  const [createAccount, setCreateAccount] = useState(false);
  const [producteurCredentials, setProducteurCredentials] = useState<{email: string, password: string} | null>(null);

  const handleSubmit = () => {
    // Valider le formulaire
    if (!newDossier.operateurNom || !newDossier.typeProduit) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    // Submit the dossier to parent component
    onSubmit();
    
    // Si l'option est cochée, créer un compte producteur après la soumission du dossier
    if (createAccount) {
      // Le dossier est créé par la fonction onSubmit, donc on doit attendre un peu avant de créer le compte
      setTimeout(() => {
        const latestDossier = JSON.parse(localStorage.getItem('dossiers') || '[]').pop();
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
    }
  };

  const handleAccountCreationToggle = () => {
    setCreateAccount(!createAccount);
  };

  const closeDialog = () => {
    onOpenChange(false);
    setProducteurCredentials(null);
    setCreateAccount(false);
  };

  // Define dummy handlers to satisfy the DossierForm props requirements
  const handleDummySubmit = () => {};
  const handleDummyCancel = () => {};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-certif-blue hover:bg-certif-blue/90">
          <PlusCircle className="mr-2" size={16} />
          Nouveau dossier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau dossier</DialogTitle>
          <DialogDescription>
            Enregistrer les informations de base du dossier.
          </DialogDescription>
        </DialogHeader>
        
        {producteurCredentials ? (
          <>
            <div className="bg-green-50 border border-green-200 rounded-md p-4 my-4">
              <h3 className="font-semibold text-green-700 mb-2">Compte producteur créé</h3>
              <p className="text-sm text-green-600 mb-1">Email: <span className="font-mono">{producteurCredentials.email}</span></p>
              <p className="text-sm text-green-600">Mot de passe: <span className="font-mono">password</span></p>
              <p className="text-xs text-green-500 mt-2">Ces informations ont été communiquées au producteur.</p>
            </div>
            <DialogFooter>
              <Button onClick={closeDialog}>Fermer</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DossierForm
              dossier={newDossier}
              setDossier={setNewDossier}
              onSubmit={handleDummySubmit}
              onCancel={handleDummyCancel}
            />
            
            <div className="flex items-center space-x-2 my-4">
              <Checkbox 
                id="create-account" 
                checked={createAccount} 
                onCheckedChange={handleAccountCreationToggle} 
              />
              <label
                htmlFor="create-account"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Créer un compte producteur
              </label>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={closeDialog}>Annuler</Button>
              <Button onClick={handleSubmit}>Ajouter le dossier</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddDossierDialog;
