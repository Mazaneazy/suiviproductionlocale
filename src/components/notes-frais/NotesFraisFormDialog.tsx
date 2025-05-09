
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import NotesFraisForm from './NotesFraisForm';
import { Dossier, NoteFrais } from '@/types';

interface NotesFraisFormDialogProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  newNoteFrais: Partial<NoteFrais>;
  dossiers: Dossier[];
  fileInputRef: React.RefObject<HTMLInputElement>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDossierChange: (value: string) => Partial<NoteFrais>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
}

const NotesFraisFormDialog: React.FC<NotesFraisFormDialogProps> = ({
  dialogOpen,
  setDialogOpen,
  newNoteFrais,
  dossiers,
  fileInputRef,
  onInputChange,
  onDossierChange,
  onFileChange,
  onSave
}) => {
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle note de frais</DialogTitle>
        </DialogHeader>
        <NotesFraisForm
          newNoteFrais={newNoteFrais}
          dossiers={dossiers}
          fileInputRef={fileInputRef}
          onInputChange={onInputChange}
          onDossierChange={onDossierChange}
          onFileChange={onFileChange}
          onSave={onSave}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NotesFraisFormDialog;
