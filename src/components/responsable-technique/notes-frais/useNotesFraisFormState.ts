
import { useRef } from 'react';
import { useNotesFraisForm } from './useNotesFraisForm';
import { Dossier } from '@/types';

export const useNotesFraisFormState = (
  dossier: Dossier,
  onNoteFraisCreated: () => void
) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
  } = useNotesFraisForm(dossier, onNoteFraisCreated);

  const handleReset = () => {
    setFraisGestion(50000);
    setFraisInspection(75000);
    setFraisSurveillance(40000);
    setDescription('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return {
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
  };
};
