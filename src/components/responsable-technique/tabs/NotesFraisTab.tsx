
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Dossier } from '@/types';
import { Plus } from 'lucide-react';

interface NotesFraisTabProps {
  dossier: Dossier | null;
  onNoteFraisCreated: () => void;
}

const NotesFraisTab: React.FC<NotesFraisTabProps> = ({ dossier }) => {
  const navigate = useNavigate();

  if (!dossier) return null;
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Élaboration de la note de frais</h2>
      <p className="mb-4">
        Créez une note de frais pour le dossier de {dossier.operateurNom}.
      </p>
      <Button 
        onClick={() => navigate(`/notes-frais/add/${dossier.id}`)}
        className="bg-certif-blue hover:bg-certif-blue/90"
      >
        <Plus className="mr-2 h-4 w-4" />
        Créer une note de frais
      </Button>
    </div>
  );
};

export default NotesFraisTab;
