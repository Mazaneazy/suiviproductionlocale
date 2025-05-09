
import React from 'react';
import { Users } from 'lucide-react';
import ComiteTechniqueForm from '../comite/ComiteTechniqueForm';
import { Dossier, ComiteTechnique } from '@/types';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ComiteTabProps {
  dossier: Dossier | null;
  onSaveComite: (comite: ComiteTechnique) => void;
}

const ComiteTab: React.FC<ComiteTabProps> = ({ dossier, onSaveComite }) => {
  if (!dossier) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <Alert variant="info" className="bg-blue-50 text-blue-800 border-blue-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>
            Veuillez sélectionner un dossier pour composer un comité technique.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Users className="h-5 w-5 mr-2 text-certif-blue" />
        Composition du comité technique
      </h2>
      <p className="text-gray-600 mb-6">
        Constituer le comité technique chargé de l'évaluation du dossier de {dossier.operateurNom} et de la définition des paramètres à évaluer.
      </p>
      
      <ComiteTechniqueForm 
        dossier={dossier} 
        onSave={onSaveComite}
        existingComite={dossier.comiteTechnique}
      />
    </div>
  );
};

export default ComiteTab;
