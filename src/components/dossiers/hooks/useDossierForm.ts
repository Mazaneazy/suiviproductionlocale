
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Dossier } from '@/types';

export const useDossierForm = (
  newDossier: Omit<Dossier, 'id'>,
  setNewDossier: React.Dispatch<React.SetStateAction<Omit<Dossier, 'id'>>>,
  onSubmit: () => void
) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Array<{ name: string; file: File }>>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // If the délai is modified, recalculate the date butoir
    if (name === 'delai') {
      const delaiValue = parseInt(value) || 0;
      const dateTransmission = new Date(newDossier.dateTransmission);
      const dateButoir = new Date(dateTransmission);
      dateButoir.setDate(dateTransmission.getDate() + delaiValue);
      
      setNewDossier({
        ...newDossier,
        [name]: delaiValue,
        dateButoir: dateButoir.toISOString().split('T')[0],
      });
    }
    // If the date de transmission is modified, recalculate the date butoir
    else if (name === 'dateTransmission') {
      const dateTransmission = new Date(value);
      const dateButoir = new Date(dateTransmission);
      dateButoir.setDate(dateTransmission.getDate() + newDossier.delai);
      
      setNewDossier({
        ...newDossier,
        [name]: value,
        dateButoir: dateButoir.toISOString().split('T')[0],
      });
    }
    else {
      setNewDossier({
        ...newDossier,
        [name]: value,
      });
    }
  };

  const handleDocumentAdd = (file: File) => {
    setDocuments([...documents, { name: file.name, file }]);
  };

  const handleDocumentRemove = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleAddDossier = () => {
    // Vérifier que tous les champs obligatoires sont remplis
    if (!newDossier.operateurNom || !newDossier.typeProduit) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
      });
      return;
    }
    
    onSubmit();
  };

  return {
    handleInputChange,
    handleAddDossier,
    documents,
    handleDocumentAdd,
    handleDocumentRemove
  };
};
