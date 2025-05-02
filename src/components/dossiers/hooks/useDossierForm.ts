
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Dossier, DocumentDossier } from '@/types';

export interface DocumentUpload {
  type: 'registre_commerce' | 'carte_contribuable' | 'processus_production' | 'certificats_conformite' | 'liste_personnel' | 'plan_localisation';
  file: File | null;
  label: string;
  required: boolean;
}

export const useDossierForm = (
  newDossier: Omit<Dossier, 'id'>,
  setNewDossier: React.Dispatch<React.SetStateAction<Omit<Dossier, 'id'>>>,
  onSubmit: () => void
) => {
  const { toast } = useToast();
  
  const [documents, setDocuments] = useState<DocumentUpload[]>([
    { type: 'registre_commerce', file: null, label: 'Registre de Commerce', required: true },
    { type: 'carte_contribuable', file: null, label: 'Carte de Contribuable (NIU)', required: true },
    { type: 'processus_production', file: null, label: 'Schéma du processus de production', required: true },
    { type: 'certificats_conformite', file: null, label: 'Certificats de Conformité', required: false },
    { type: 'liste_personnel', file: null, label: 'Liste du personnel (sur papier entête)', required: true },
    { type: 'plan_localisation', file: null, label: 'Plan de localisation', required: true },
  ]);
  
  const fileInputRefs = {
    registre_commerce: useRef<HTMLInputElement>(null),
    carte_contribuable: useRef<HTMLInputElement>(null),
    processus_production: useRef<HTMLInputElement>(null),
    certificats_conformite: useRef<HTMLInputElement>(null),
    liste_personnel: useRef<HTMLInputElement>(null),
    plan_localisation: useRef<HTMLInputElement>(null),
  };

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0] || null;
    
    if (file && !file.type.includes('pdf')) {
      toast({
        variant: "destructive",
        title: "Format invalide",
        description: "Veuillez télécharger un fichier PDF uniquement.",
      });
      return;
    }
    
    setDocuments(documents.map(doc => 
      doc.type === type ? { ...doc, file } : doc
    ));
  };

  const removeFile = (type: string) => {
    setDocuments(documents.map(doc => 
      doc.type === type ? { ...doc, file: null } : doc
    ));
    
    // Reset the file input
    const ref = fileInputRefs[type as keyof typeof fileInputRefs];
    if (ref.current) {
      ref.current.value = '';
    }
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
    
    // Remove document validation check to make button work without attachments
    
    // Create document objects from files that exist (if any)
    const documentObjects: Omit<DocumentDossier, 'id'>[] = documents
      .filter(doc => doc.file)
      .map(doc => ({
        dossierId: '',  // Will be filled by the createDossier function
        type: doc.type,
        nom: doc.file!.name,
        url: URL.createObjectURL(doc.file!),  // In a real app, this would be uploaded to a server
        dateUpload: new Date().toISOString(),
        status: 'en_attente' as 'valide' | 'rejete' | 'en_attente'
      }));
    
    // Add documents to the dossier
    setNewDossier(prevDossier => ({
      ...prevDossier,
      documents: documentObjects
    }));
    
    // Call onSubmit after updating the state
    setTimeout(() => {
      onSubmit();
    }, 0);
  };
  
  return {
    handleInputChange,
    handleAddDossier,
    documents,
    fileInputRefs,
    handleFileChange,
    removeFile
  };
};
