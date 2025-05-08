
import React from 'react';
import NotesFraisForm from '../NotesFraisForm';
import { Dossier } from '@/types';

interface NotesFraisTabProps {
  dossier: Dossier | null;
  onNoteFraisCreated: () => void;
}

const NotesFraisTab: React.FC<NotesFraisTabProps> = ({ dossier, onNoteFraisCreated }) => {
  if (!dossier) return null;
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Élaboration de la note de frais</h2>
      <NotesFraisForm 
        dossier={dossier}
        onNoteFraisCreated={onNoteFraisCreated}
      />
    </div>
  );
};

export default NotesFraisTab;
