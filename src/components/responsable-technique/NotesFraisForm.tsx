
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Dossier } from '@/types';
import { useNotesFraisFormState } from './notes-frais/useNotesFraisFormState';
import InformationsGenerales from './notes-frais/InformationsGenerales';
import FraisAdditionnels from './notes-frais/FraisAdditionnels';
import RecapitulatifFrais from './notes-frais/RecapitulatifFrais';
import FormActions from './notes-frais/FormActions';
import ParametresAnalyseForm from '@/components/notes-frais/ParametresAnalyseForm';

interface NotesFraisFormProps {
  dossier: Dossier;
  onNoteFraisCreated?: () => void;
}

const NotesFraisForm: React.FC<NotesFraisFormProps> = ({ 
  dossier, 
  onNoteFraisCreated = () => {} 
}) => {
  const { currentUser } = useAuth();
  
  const {
    newNoteFrais,
    setNewNoteFrais,
    total,
    handleInputChange,
    handleFileChange,
    handleReset,
    handleSubmit,
    selectedParametres,
    fraisGestion,
    fraisInspection,
    fraisSurveillance,
    totalPrix,
    description,
    setDescription,
    isSubmitting,
    setFraisGestion,
    setFraisInspection,
    setFraisSurveillance,
    fileInputRef,
    toggleParametre,
    setSelectedParametres
  } = useNotesFraisFormState(dossier, onNoteFraisCreated);

  // Handler for description input change
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };
  
  // This adapter function will convert the signature from string[] to what the form expects
  const handleParametresChange = (parametres: string[]) => {
    setSelectedParametres(parametres);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InformationsGenerales
        newNoteFrais={newNoteFrais}
        onInputChange={handleInputChange}
        dossierNom={dossier?.operateurNom || "Non spécifié"}
      />
      
      <FraisAdditionnels
        newNoteFrais={newNoteFrais}
        onInputChange={handleInputChange}
      />
      
      <ParametresAnalyseForm
        selectedParametres={selectedParametres}
        onChange={handleParametresChange}
      />
      
      <RecapitulatifFrais 
        fraisGestion={fraisGestion}
        fraisInspection={fraisInspection}
        fraisAnalyses={totalPrix}
        fraisSurveillance={fraisSurveillance}
        total={total}
      />
      
      <FormActions 
        isSubmitting={isSubmitting}
        onReset={handleReset}
      />
    </form>
  );
};

export default NotesFraisForm;
