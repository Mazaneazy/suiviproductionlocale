
import React from 'react';
import { Users } from 'lucide-react';
import ComiteTechniqueForm from '../comite/ComiteTechniqueForm';
import { ComiteTechnique, Dossier } from '@/types';

interface ComiteTabProps {
  dossier: Dossier | null;
  onSaveComite: (comite: ComiteTechnique) => void;
}

const ComiteTab: React.FC<ComiteTabProps> = ({ dossier, onSaveComite }) => {
  if (!dossier) return null;
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Users className="h-5 w-5 mr-2 text-certif-blue" />
        Composition du comité technique
      </h2>
      <ComiteTechniqueForm 
        dossier={dossier}
        onSave={onSaveComite}
      />
    </div>
  );
};

export default ComiteTab;
