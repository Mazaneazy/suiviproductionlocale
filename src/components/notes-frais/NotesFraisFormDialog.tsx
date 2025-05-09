
import React from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  newNoteFrais,
  dossiers,
  fileInputRef,
  onInputChange,
  onDossierChange,
  onFileChange,
  onSave
}) => {
  // Assurons-nous que toutes les propriétés requises sont fournies avec des valeurs par défaut si nécessaire
  const formattedNoteFrais = {
    dossierId: newNoteFrais.dossierId || '',
    date: newNoteFrais.date || new Date().toISOString().split('T')[0],
    fraisGestion: newNoteFrais.fraisGestion || 0,
    fraisInspection: newNoteFrais.fraisInspection || 0,
    fraisAnalyses: newNoteFrais.fraisAnalyses || 0,
    fraisSurveillance: newNoteFrais.fraisSurveillance || 0,
    commentaire: newNoteFrais.commentaire || ''
  };

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Ajouter une nouvelle note de frais</DialogTitle>
      </DialogHeader>
      <NotesFraisForm
        newNoteFrais={formattedNoteFrais}
        dossiers={dossiers}
        fileInputRef={fileInputRef}
        onInputChange={onInputChange}
        onDossierChange={onDossierChange}
        onFileChange={onFileChange}
        onSave={onSave}
      />
    </DialogContent>
  );
};

export default NotesFraisFormDialog;
