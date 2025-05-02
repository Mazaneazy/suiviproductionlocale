import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/DataContext';
import { DocumentDossier } from '@/types';

interface DocumentUpload {
  type: 'registre_commerce' | 'carte_contribuable' | 'processus_production' | 'certificats_conformite' | 'liste_personnel' | 'plan_localisation';
  file: File | null;
  label: string;
  required: boolean;
}

export const useAccueilForm = () => {
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addDossier } = useData();

  const [entreprise, setEntreprise] = useState('');
  const [promoteur, setPromoteur] = useState('');
  const [telephone, setTelephone] = useState('');
  const [produits, setProduits] = useState('');
  const [validated, setValidated] = useState(false);
  
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

  const validateForm = () => {
    // Validation
    if (!entreprise || !promoteur || !telephone || !produits) {
      toast({
        variant: "destructive",
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires.",
      });
      return false;
    }
    
    // Check required documents
    const missingDocuments = documents
      .filter(doc => doc.required && !doc.file)
      .map(doc => doc.label);
    
    if (missingDocuments.length > 0) {
      toast({
        variant: "destructive",
        title: "Documents manquants",
        description: `Veuillez télécharger les documents requis: ${missingDocuments.join(', ')}`,
      });
      return false;
    }

    // Mark the form as validated
    setValidated(true);
    
    toast({
      title: "Dossier validé",
      description: "Le dossier a été validé avec succès. Vous pouvez maintenant le transmettre.",
    });
    
    return true;
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validated) {
      toast({
        variant: "destructive",
        title: "Validation requise",
        description: "Veuillez d'abord valider le dossier avant de le transmettre.",
      });
      return;
    }
    
    // Create document objects from files
    const documentObjects: Omit<DocumentDossier, 'id'>[] = documents
      .filter(doc => doc.file)
      .map(doc => ({
        dossierId: '',  // Will be filled by the createDossier function
        type: doc.type,
        nom: doc.file!.name,
        url: URL.createObjectURL(doc.file!),  // In a real app, this would be uploaded to a server
        dateUpload: new Date().toISOString(),
        status: 'en_attente' as 'en_attente' | 'valide' | 'rejete'
      }));
    
    // Create the dossier with documents
    const newDossier = {
      operateurNom: entreprise,
      promoteurNom: promoteur,
      telephone,
      typeProduit: produits,
      dateTransmission: new Date().toISOString().split('T')[0],
      responsable: 'Responsable Technique',
      status: 'en_attente' as const,
      delai: 30,
      dateButoir: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      documents: documentObjects
    };
    
    addDossier(newDossier);
    
    toast({
      title: "Dossier transmis",
      description: "Le dossier a été transmis au Responsable Technique avec succès.",
    });
    
    // Reset form
    setEntreprise('');
    setPromoteur('');
    setTelephone('');
    setProduits('');
    setDocuments(documents.map(doc => ({ ...doc, file: null })));
    setValidated(false);
    
    // Clear all file inputs
    Object.values(fileInputRefs).forEach(ref => {
      if (ref.current) ref.current.value = '';
    });
    
    navigate('/dossiers');
  };

  return {
    entreprise, setEntreprise,
    promoteur, setPromoteur,
    telephone, setTelephone,
    produits, setProduits,
    documents, setDocuments,
    fileInputRefs,
    validated, setValidated,
    handleFileChange,
    removeFile,
    validateForm,
    handleFinalSubmit
  };
};
