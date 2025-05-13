
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2" size={16} />
          Ajouter un dossier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau dossier</DialogTitle>
        </DialogHeader>
        <DossierDialogContent
          newDossier={newDossier}
          setNewDossier={setNewDossier}
          onSubmit={onSubmit}
          onClose={() => onOpenChange(false)}
          dossierIdAfterSubmit={latestDossierId}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddDossierDialog;
