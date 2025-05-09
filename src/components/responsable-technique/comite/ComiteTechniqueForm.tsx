
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dossier, ComiteTechnique } from '@/types';
import AddMembreForm from './AddMembreForm';
import ChefComiteSection from './ChefComiteSection';
import MembresComiteList from './MembresComiteList';
import { useComiteTechnique } from './useComiteTechnique';

interface ComiteTechniqueFormProps {
  dossier: Dossier;
  onSave: (comite: ComiteTechnique) => void;
  existingComite?: ComiteTechnique | null;
}

const ComiteTechniqueForm: React.FC<ComiteTechniqueFormProps> = ({ 
  dossier, 
  onSave, 
  existingComite 
}) => {
  const {
    membres,
    chefComite,
    nouveauMembre,
    handleMembreChange,
    handleAddMembre,
    handleRemoveMembre,
    handleSaveComite,
  } = useComiteTechnique({ dossier, existingComite, onSave });

  return (
    <div className="space-y-6">
      <AddMembreForm
        nouveauMembre={nouveauMembre}
        onMembreChange={handleMembreChange}
        onAddMembre={handleAddMembre}
      />
      
      <ChefComiteSection chefComite={chefComite} />
      
      <MembresComiteList 
        membres={membres}
        onRemoveMembre={handleRemoveMembre}
      />
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveComite} 
          className="bg-certif-blue hover:bg-certif-blue/90"
        >
          Enregistrer le comité technique
        </Button>
      </div>
    </div>
  );
};

export default ComiteTechniqueForm;
