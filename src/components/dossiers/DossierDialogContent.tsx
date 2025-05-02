
import React from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Dossier } from '@/types';
import DossierForm from './DossierForm';
import AccountCreationSuccess from './AccountCreationSuccess';
import AttachmentSection from './AttachmentSection';
import { useAttachments } from '@/hooks/useAttachments';
import { useProducteurAccount } from '@/hooks/useProducteurAccount';
import { useDocumentProcessing } from '@/hooks/useDocumentProcessing';

interface DossierDialogContentProps {
  newDossier: Omit<Dossier, 'id'>;
  setNewDossier: React.Dispatch<React.SetStateAction<Omit<Dossier, 'id'>>>;
  onSubmit: () => void;
  onClose: () => void;
  dossierIdAfterSubmit?: string;
}

const DossierDialogContent: React.FC<DossierDialogContentProps> = ({
  newDossier,
  setNewDossier,
  onSubmit,
  onClose,
  dossierIdAfterSubmit
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
    console.log("Traitement des pièces jointes avec ID:", dossierIdAfterSubmit);
    setTimeout(() => {
      processAttachments(attachments, dossierIdAfterSubmit);
    }, 500);
  };

  if (producteurCredentials) {
    return (
      <AccountCreationSuccess 
        email={producteurCredentials.email}
        password={producteurCredentials.password}
        onClose={onClose}
      />
    );
  }

  return (
    <>
      <DossierForm
        newDossier={newDossier}
        setNewDossier={setNewDossier}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
      
      <AttachmentSection 
        attachments={attachments}
        createAccount={createAccount}
        onAddAttachment={handleAddAttachment}
        onRemoveAttachment={handleRemoveAttachment}
        onCreateAccountToggle={handleAccountCreationToggle}
      />
      
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit}>Ajouter le dossier</Button>
      </DialogFooter>
    </>
  );
};

export default DossierDialogContent;
