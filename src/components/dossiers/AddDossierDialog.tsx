
import React from 'react';
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
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dossier } from '@/types';
import DossierForm from './DossierForm';
import AccountCreationSuccess from './AccountCreationSuccess';
import AttachmentSection from './AttachmentSection';
import { useAttachments } from '@/hooks/useAttachments';
import { useProducteurAccount } from '@/hooks/useProducteurAccount';
import { useDocumentProcessing } from '@/hooks/useDocumentProcessing';

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
  const { 
    attachments, 
    handleAddAttachment, 
    handleRemoveAttachment, 
    resetAttachments 
  } = useAttachments();
  
  const { 
    createAccount, 
    producteurCredentials, 
    handleAccountCreationToggle, 
    createProducteurAccountFromDossier, 
    resetState: resetProducteurState 
  } = useProducteurAccount();
  
  const { processAttachments } = useDocumentProcessing();

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
      createProducteurAccountFromDossier();
    }
    
    // Ajouter les pièces jointes au dossier
    processAttachments(attachments);
  };

  const closeDialog = () => {
    onOpenChange(false);
    resetProducteurState();
    resetAttachments();
  };

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
          <AccountCreationSuccess 
            email={producteurCredentials.email}
            password={producteurCredentials.password}
            onClose={closeDialog}
          />
        ) : (
          <>
            <DossierForm
              newDossier={newDossier}
              setNewDossier={setNewDossier}
              onSubmit={handleSubmit}
              onCancel={closeDialog}
            />
            
            <AttachmentSection 
              attachments={attachments}
              createAccount={createAccount}
              onAddAttachment={handleAddAttachment}
              onRemoveAttachment={handleRemoveAttachment}
              onCreateAccountToggle={handleAccountCreationToggle}
            />
            
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
