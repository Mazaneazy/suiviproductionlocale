
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
    handleRejectNoteFrais
  } = useNotesFraisActions(
    updateNoteFrais,
    setSelectedNote,
    () => {} // Removed setDetailDialogOpen
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
      newNoteFrais.frais_gestion + 
      newNoteFrais.frais_inspection + 
      newNoteFrais.frais_analyses + 
      newNoteFrais.frais_surveillance;
    
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
      dateCreation: new Date().toISOString(),
      description: `Note de frais - ${new Date(newNoteFrais.date).toLocaleDateString()}`,
      montant: total,
      status: newNoteFrais.status,
      acquitte: false,
      frais_gestion: newNoteFrais.frais_gestion,
      frais_inspection: newNoteFrais.frais_inspection,
      frais_analyses: newNoteFrais.frais_analyses,
      frais_surveillance: newNoteFrais.frais_surveillance,
      commentaire: newNoteFrais.commentaire || undefined,
      fichier_url: fichierUrl || undefined,
      notification_envoyee: false,
      operateur_notifie: false
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
      frais_gestion: 50000,
      frais_inspection: 75000,
      frais_analyses: 60000,
      frais_surveillance: 40000,
      status: 'en_attente',
      commentaire: '',
      description: '',
      montant: 0,
      fichier_url: '',
      notification_envoyee: false,
      operateur_notifie: false
    });
    
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
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
    getStatusColor,
    formatStatus
  };
};
