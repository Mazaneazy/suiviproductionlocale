
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { DocumentUpload } from './DocumentsSection';
import { getDefaultDocumentsList } from '@/utils/documentUtils';

export const useDossierForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addDossier } = useData();
  
  const [entreprise, setEntreprise] = useState('');
  const [promoteur, setPromoteur] = useState('');
  const [telephone, setTelephone] = useState('');
  const [produits, setProduits] = useState('');
  
  // Now use the utility function to get the default documents list
  const [documents, setDocuments] = useState<DocumentUpload[]>(getDefaultDocumentsList());

  const handleDocumentChange = (type: string, file: File | null) => {
    setDocuments(documents.map(doc => 
      doc.type === type ? { ...doc, file } : doc
    ));
  };

  // Fonction pour créer un nouveau dossier à partir des données du formulaire
  const createDossierObject = () => {
    // Create document objects from files
    const documentObjects = documents
      .filter(doc => doc.file)
      .map(doc => ({
        id: Math.random().toString(36).substring(2, 11),
        dossierId: '',  // To be filled after dossier creation
        type: doc.type,
        nom: doc.file!.name,
        url: URL.createObjectURL(doc.file!),  // In a real app, this would be uploaded to a server
        dateUpload: new Date().toISOString(),
      }));
    
    // Create the dossier object
    return {
      operateurNom: entreprise,
      promoteurNom: promoteur,
      telephone,
      typeProduit: produits,
      dateTransmission: new Date().toISOString().split('T')[0],
      responsable: 'Responsable Technique',
      status: 'en_attente' as const,
      delai: 30,
      dateButoir: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      documents: documentObjects,
    };
  };

  // Fonction pour enregistrer le dossier sans le transmettre
  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Validation de base (uniquement l'entreprise est obligatoire pour l'enregistrement)
    if (!entreprise) {
      toast({
        variant: "destructive",
        title: "Champ obligatoire manquant",
        description: "Veuillez au moins saisir le nom de l'entreprise.",
      });
      return;
    }
    
    // Ajouter le dossier
    const newDossier = createDossierObject();
    addDossier(newDossier);
    
    toast({
      title: "Dossier enregistré",
      description: "Le dossier a été enregistré avec succès.",
    });
    
    // Reset form
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!entreprise || !promoteur || !telephone || !produits) {
      toast({
        variant: "destructive",
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires.",
      });
      return;
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
      return;
    }
    
    // Add the dossier
    const newDossier = createDossierObject();
    addDossier(newDossier);
    
    toast({
      title: "Dossier transmis",
      description: "Le dossier a été transmis au Responsable Technique avec succès.",
    });
    
    // Reset form and navigate
    resetForm();
    navigate('/dossiers');
  };

  const resetForm = () => {
    setEntreprise('');
    setPromoteur('');
    setTelephone('');
    setProduits('');
    setDocuments(getDefaultDocumentsList());
  };

  return {
    entreprise,
    setEntreprise,
    promoteur,
    setPromoteur,
    telephone,
    setTelephone,
    produits,
    setProduits,
    documents,
    handleDocumentChange,
    handleSave,
    handleSubmit
  };
};
