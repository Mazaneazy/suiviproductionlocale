
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dossier } from '@/types';
import DossierDialogContent from './DossierDialogContent';

interface AddDossierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newDossier: Omit<Dossier, 'id'>;
  setNewDossier: React.Dispatch<React.SetStateAction<Omit<Dossier, 'id'>>>;
  onSubmit: () => void;
  latestDossierId?: string;
}

const AddDossierDialog: React.FC<AddDossierDialogProps> = ({
  open,
  onOpenChange,
  newDossier,
  setNewDossier,
  onSubmit,
  latestDossierId
}) => {
  const handleCloseDialog = () => {
    onOpenChange(false);
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
        
        <DossierDialogContent 
          newDossier={newDossier}
          setNewDossier={setNewDossier}
          onSubmit={onSubmit}
          onClose={handleCloseDialog}
          dossierIdAfterSubmit={latestDossierId}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddDossierDialog;
