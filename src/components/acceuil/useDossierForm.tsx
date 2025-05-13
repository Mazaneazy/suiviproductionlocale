
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { DocumentUpload } from './DocumentsSection';
import { getDefaultDocumentsList } from '@/utils/documentUtils';
import { doesCompanyNameExist, generateDossierReference } from '@/utils/dossierUtils';

export const useDossierForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addDossier } = useData();
  
  const [entreprise, setEntreprise] = useState('');
  const [promoteur, setPromoteur] = useState('');
  const [telephone, setTelephone] = useState('');
  const [produits, setProduits] = useState('');
  const [email, setEmail] = useState('');
  const [adresse, setAdresse] = useState('');
  const [reference, setReference] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Utiliser la fonction utilitaire pour obtenir la liste des documents par défaut
  const [documents, setDocuments] = useState<DocumentUpload[]>(getDefaultDocumentsList());

  const handleDocumentChange = (type: string, file: File | null) => {
    setDocuments(documents.map(doc => 
      doc.type === type ? { ...doc, file } : doc
    ));
  };

  // Vérifier si le nom d'entreprise existe déjà
  const validateEntrepriseName = (name: string): boolean => {
    if (doesCompanyNameExist(name)) {
      toast({
        variant: "destructive",
        title: "Erreur d'enregistrement",
        description: `Une entreprise avec le nom "${name}" existe déjà dans le système.`,
      });
      return false;
    }
    return true;
  };

  // Fonction pour créer un nouveau dossier à partir des données du formulaire
  const createDossierObject = () => {
    // Générer une référence unique pour ce dossier
    const dossierReference = generateDossierReference();
    setReference(dossierReference);
    
    // Créer des objets de document à partir des fichiers
    const documentObjects = documents
      .filter(doc => doc.file)
      .map(doc => ({
        id: Math.random().toString(36).substring(2, 11),
        dossierId: '',  // À remplir après la création du dossier
        type: doc.type,
        nom: doc.file!.name,
        url: URL.createObjectURL(doc.file!),  // Dans une vraie application, cela serait téléchargé sur un serveur
        dateUpload: new Date().toISOString(),
        status: 'en_attente' as const
      }));
    
    // Créer l'objet dossier
    return {
      operateur_nom: entreprise,
      promoteur_nom: promoteur,
      telephone,
      email: email || undefined,
      adresse: adresse || undefined,
      typeProduit: produits,
      reference: dossierReference,
      dateTransmission: new Date().toISOString().split('T')[0],
      responsable: 'Responsable Technique',
      status: 'en_attente' as const,
      delai: 30,
      dateButoir: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      documents: documentObjects,
      commentaires: "", // Champ pour les commentaires ultérieurs
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
    
    // Vérifier que le nom d'entreprise est unique
    if (!validateEntrepriseName(entreprise)) {
      return;
    }
    
    // Ajouter le dossier
    const newDossier = createDossierObject();
    addDossier(newDossier);
    
    toast({
      title: "Dossier enregistré",
      description: "Le dossier a été enregistré avec succès.",
    });
    
    // Réinitialiser le formulaire
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validation
      if (!entreprise || !promoteur || !telephone || !produits) {
        toast({
          variant: "destructive",
          title: "Formulaire incomplet",
          description: "Veuillez remplir tous les champs obligatoires.",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Vérifier que le nom d'entreprise est unique
      if (!validateEntrepriseName(entreprise)) {
        setIsSubmitting(false);
        return;
      }
      
      // Vérifier les documents requis
      const missingDocuments = documents
        .filter(doc => doc.required && !doc.file)
        .map(doc => doc.label);
      
      if (missingDocuments.length > 0) {
        toast({
          variant: "destructive",
          title: "Documents manquants",
          description: `Veuillez télécharger les documents requis: ${missingDocuments.join(', ')}`,
        });
        setIsSubmitting(false);
        return;
      }
      
      // Ajouter le dossier
      const newDossier = createDossierObject();
      addDossier(newDossier);
      
      // Simuler un délai pour montrer le chargement dans l'interface utilisateur
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Dossier transmis",
        description: "Le dossier a été transmis au Responsable Technique avec succès.",
      });
      
      // Réinitialiser le formulaire et naviguer
      resetForm();
      navigate('/dossiers');
    } catch (error) {
      console.error("Erreur lors de la soumission du dossier:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission du dossier.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEntreprise('');
    setPromoteur('');
    setTelephone('');
    setProduits('');
    setEmail('');
    setAdresse('');
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
    email,
    setEmail,
    adresse,
    setAdresse,
    documents,
    reference,
    handleDocumentChange,
    handleSave,
    handleSubmit,
    isSubmitting
  };
};
