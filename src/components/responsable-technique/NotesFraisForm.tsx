
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
    selectedParametres,
    fraisGestion,
    fraisInspection,
    fraisSurveillance,
    total,
    description,
    setDescription,
    isSubmitting,
    handleSubmit,
    totalPrix,
    setFraisGestion,
    setFraisInspection,
    setFraisSurveillance,
    fileInputRef,
    handleReset
  } = useNotesFraisFormState(dossier, onNoteFraisCreated);

  // Handler for description input change
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };
  
  // Handler for file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // The actual file change handling is done in useNotesFraisForm
    // This is just a pass-through method
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InformationsGenerales
        description={description}
        onDescriptionChange={handleDescriptionChange}
        onFileChange={handleFileChange}
        fileInputRef={fileInputRef}
      />
      
      <FraisAdditionnels
        fraisGestion={fraisGestion}
        fraisInspection={fraisInspection}
        fraisSurveillance={fraisSurveillance}
        setFraisGestion={setFraisGestion}
        setFraisInspection={setFraisInspection}
        setFraisSurveillance={setFraisSurveillance}
      />
      
      <ParametresAnalyseForm
        selectedParametres={selectedParametres}
        onChange={() => {}} // This is handled by the hook now
      />
      
      <RecapitulatifFrais 
        fraisGestion={fraisGestion}
        fraisInspection={fraisInspection}
        fraisSurveillance={fraisSurveillance}
        total={total}
        totalPrix={totalPrix}
        description={description}
        setDescription={setDescription}
      />
      
      <FormActions 
        isSubmitting={isSubmitting}
        onReset={handleReset}
      />
    </form>
  );
};

export default NotesFraisForm;
