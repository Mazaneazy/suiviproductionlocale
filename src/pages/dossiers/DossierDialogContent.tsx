
import React from 'react';
import { Dossier } from '@/types';
import DossierForm from '../../components/dossiers/DossierForm';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
  return (
    <>
      <DossierForm
        newDossier={newDossier}
        setNewDossier={setNewDossier}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
      
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Annuler</Button>
        <Button onClick={onSubmit}>Ajouter le dossier</Button>
      </DialogFooter>
    </>
  );
};

export default DossierDialogContent;
