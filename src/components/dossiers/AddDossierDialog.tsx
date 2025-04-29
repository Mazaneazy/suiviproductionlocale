
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import DossierForm from './DossierForm';
import { Dossier } from '@/types';

interface AddDossierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newDossier: Omit<Dossier, 'id'>;
  setNewDossier: React.Dispatch<React.SetStateAction<Omit<Dossier, 'id'>>>;
  onSubmit: () => void;
}

const AddDossierDialog = ({
  open,
  onOpenChange,
  newDossier,
  setNewDossier,
  onSubmit,
}: AddDossierDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-certif-green hover:bg-certif-green/90">
          <PlusCircle className="mr-2" size={16} />
          Nouveau dossier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau dossier</DialogTitle>
        </DialogHeader>
        <DossierForm
          newDossier={newDossier}
          setNewDossier={setNewDossier}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddDossierDialog;
