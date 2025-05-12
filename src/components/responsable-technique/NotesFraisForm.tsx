
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
    handleInputChange(e); // Call the original handler too to update newNoteFrais
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InformationsGenerales
        newNoteFrais={newNoteFrais}
        onInputChange={handleInputChange}
        dossierNom={dossier?.operateurNom || "Non spécifié"}
      />
      
      <div className="form-group">
        <label htmlFor="description" className="block text-gray-700 font-medium mb-1">
          Description
        </label>
        <input
          id="description"
          name="description"
          type="text"
          value={description}
          onChange={handleDescriptionChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Description de la note de frais"
        />
      </div>
      
      <FraisAdditionnels
        newNoteFrais={newNoteFrais}
        onInputChange={handleInputChange}
      />
      
      <ParametresAnalyseForm
        selectedParametres={selectedParametres}
        onChange={setSelectedParametres}
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
