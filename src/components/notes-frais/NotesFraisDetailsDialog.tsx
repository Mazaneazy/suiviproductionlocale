
import React from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import NotesFraisDetails from './NotesFraisDetails';
import { NoteFrais, Dossier } from '@/types';

interface NotesFraisDetailsDialogProps {
  detailDialogOpen: boolean;
  setDetailDialogOpen: (open: boolean) => void;
  selectedNote: NoteFrais | null;
  dossiers: Dossier[];
  getStatusColor: (status: string) => string;
  formatStatus: (status: string) => string;
  calculerTotal: (note: NoteFrais) => number;
}

const NotesFraisDetailsDialog: React.FC<NotesFraisDetailsDialogProps> = ({
  selectedNote,
  dossiers,
  getStatusColor,
  formatStatus,
  calculerTotal
}) => {
  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Détails de la note de frais</DialogTitle>
      </DialogHeader>
      {selectedNote && (
        <NotesFraisDetails
          note={selectedNote}
          dossiers={dossiers}
          getStatusColor={getStatusColor}
          formatStatus={formatStatus}
          calculerTotal={calculerTotal}
        />
      )}
    </DialogContent>
  );
};

export default NotesFraisDetailsDialog;
