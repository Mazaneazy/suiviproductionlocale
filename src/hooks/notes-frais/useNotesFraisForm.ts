
import { RefObject } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useNotesFraisForm = (
  newNoteFrais: any,
  setNewNoteFrais: (noteFrais: any) => void,
  setUploadedFile: (file: File | null) => void
) => {
  const { toast } = useToast();

  // Fonction pour mettre à jour les champs de la nouvelle note de frais
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'fraisGestion' || name === 'fraisInspection' || name === 'fraisAnalyses' || name === 'fraisSurveillance') {
      setNewNoteFrais({
        ...newNoteFrais,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setNewNoteFrais({
        ...newNoteFrais,
        [name]: value,
      });
    }
  };

  // Fonction pour gérer l'upload de fichier
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      toast({
        title: "Fichier sélectionné",
        description: `${file.name} a été sélectionné.`,
      });
    }
  };

  return {
    handleInputChange,
    handleFileChange
  };
};
