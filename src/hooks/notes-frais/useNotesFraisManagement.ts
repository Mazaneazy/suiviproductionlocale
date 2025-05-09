
import { useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNotesFraisState } from './useNotesFraisState';
import { useNotesFraisForm } from './useNotesFraisForm';
import { useNotesFraisActions } from './useNotesFraisActions';
import { useNotesFraisUtils } from './useNotesFraisUtils';

export const useNotesFraisManagement = () => {
  const {
    dossiers,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    dialogOpen,
    setDialogOpen,
    detailDialogOpen,
    setDetailDialogOpen,
    selectedNote,
    setSelectedNote,
    uploadedFile,
    setUploadedFile,
    newNoteFrais,
    setNewNoteFrais,
    filteredNotesFrais,
    addNoteFrais,
    updateNoteFrais,
    currentUser
  } = useNotesFraisState();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { handleInputChange, handleFileChange } = useNotesFraisForm(
    newNoteFrais,
    setNewNoteFrais,
    setUploadedFile
  );

  const { 
    handleSendNotification,
    handleMarkAsNotified,
    handleValidateNoteFrais,
    handleRejectNoteFrais,
    handleShowDetails
  } = useNotesFraisActions(
    updateNoteFrais,
    setSelectedNote,
    setDetailDialogOpen
  );

  const { calculerTotal, getStatusColor, formatStatus } = useNotesFraisUtils();

  // Fonction pour ajouter une nouvelle note de frais
  const handleAddNoteFrais = () => {
    // Vérifier que tous les champs obligatoires sont remplis
    if (!newNoteFrais.dossierId) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner un dossier.",
      });
      return;
    }

    // Calculer le montant total
    const total = 
      newNoteFrais.fraisGestion + 
      newNoteFrais.fraisInspection + 
      newNoteFrais.fraisAnalyses + 
      newNoteFrais.fraisSurveillance;
    
    // Simuler l'upload du fichier (dans une vraie application, cela serait fait vers un service de stockage)
    let fichierUrl = '';
    if (uploadedFile) {
      // Dans une vraie application, nous téléchargerions le fichier vers un serveur
      // et obtiendrions une URL. Ici, nous simulons simplement cette URL
      fichierUrl = `document-${Date.now()}-${uploadedFile.name}`;
    }

    addNoteFrais({
      dossierId: newNoteFrais.dossierId,
      inspecteurId: newNoteFrais.inspecteurId,
      date: newNoteFrais.date,
      description: `Note de frais - ${new Date(newNoteFrais.date).toLocaleDateString()}`,
      montant: total,
      status: newNoteFrais.status,
      fraisGestion: newNoteFrais.fraisGestion,
      fraisInspection: newNoteFrais.fraisInspection,
      fraisAnalyses: newNoteFrais.fraisAnalyses,
      fraisSurveillance: newNoteFrais.fraisSurveillance,
      commentaire: newNoteFrais.commentaire || undefined,
      fichierUrl: fichierUrl || undefined,
      notificationEnvoyee: false,
      operateurNotifie: false
    });
    
    toast({
      title: "Note de frais ajoutée",
      description: "La note de frais a été créée avec succès.",
    });
    
    // Réinitialiser le formulaire
    setNewNoteFrais({
      dossierId: '',
      inspecteurId: currentUser?.id || '',
      date: new Date().toISOString().split('T')[0],
      fraisGestion: 50000,
      fraisInspection: 75000,
      fraisAnalyses: 60000,
      fraisSurveillance: 40000,
      status: 'en_attente',
      commentaire: '',
      description: '',
      montant: 0,
      fichierUrl: '',
      notificationEnvoyee: false,
      operateurNotifie: false
    });
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    setDialogOpen(false);
  };

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    dialogOpen,
    setDialogOpen,
    detailDialogOpen,
    setDetailDialogOpen,
    selectedNote,
    setSelectedNote,
    uploadedFile,
    setUploadedFile,
    newNoteFrais,
    setNewNoteFrais,
    filteredNotesFrais,
    dossiers,
    fileInputRef,
    handleInputChange,
    handleFileChange,
    handleSendNotification,
    handleMarkAsNotified,
    handleAddNoteFrais,
    handleValidateNoteFrais,
    handleRejectNoteFrais,
    calculerTotal,
    handleShowDetails,
    getStatusColor,
    formatStatus
  };
};
