
import { useState, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { useToast } from './use-toast';
import { useAuth } from '../contexts/AuthContext';
import { NoteFrais } from '../types';

export const useNotesFraisManagement = () => {
  const { notesFrais, dossiers, addNoteFrais, updateNoteFrais } = useData();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('tous');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<NoteFrais | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // État pour la nouvelle note de frais
  const [newNoteFrais, setNewNoteFrais] = useState({
    dossierId: '',
    inspecteurId: currentUser?.id || '',
    date: new Date().toISOString().split('T')[0],
    fraisGestion: 50000,
    fraisInspection: 75000,
    fraisAnalyses: 60000,
    fraisSurveillance: 40000,
    status: 'en_attente' as 'en_attente' | 'valide' | 'rejete',
    commentaire: '',
    description: '',
    montant: 0,
    fichierUrl: '',
    notificationEnvoyee: false,
    operateurNotifie: false
  });

  // Filtrer les notes de frais en fonction des critères de recherche
  const filteredNotesFrais = notesFrais.filter(note => {
    const dossier = dossiers.find(d => d.id === note.dossierId);
    
    const matchesSearch = dossier 
      ? dossier.operateurNom.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    
    const matchesStatus = statusFilter === 'tous' || note.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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

  // Fonction pour simuler l'envoi d'une notification par email
  const handleSendNotification = (noteId: string) => {
    updateNoteFrais(noteId, { 
      notificationEnvoyee: true 
    });
    
    toast({
      title: "Notification envoyée",
      description: "L'opérateur a été notifié de sa note de frais.",
    });
  };

  // Fonction pour marquer comme notifié
  const handleMarkAsNotified = (noteId: string) => {
    updateNoteFrais(noteId, { 
      operateurNotifie: true 
    });
    
    toast({
      title: "Confirmation reçue",
      description: "L'opérateur a confirmé la réception de sa note de frais.",
    });
  };

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
      fichierUrl = URL.createObjectURL(uploadedFile);
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

  // Fonction pour valider une note de frais
  const handleValidateNoteFrais = (id: string) => {
    updateNoteFrais(id, { status: 'valide' });
    toast({
      title: "Note de frais validée",
      description: "La note de frais a été validée avec succès.",
    });
  };

  // Fonction pour rejeter une note de frais
  const handleRejectNoteFrais = (id: string) => {
    updateNoteFrais(id, { status: 'rejete' });
    toast({
      title: "Note de frais rejetée",
      description: "La note de frais a été rejetée.",
    });
  };

  // Calculer le total d'une note de frais
  const calculerTotal = (note: NoteFrais) => {
    return (
      (note.fraisGestion || 0) + 
      (note.fraisInspection || 0) + 
      (note.fraisAnalyses || 0) + 
      (note.fraisSurveillance || 0)
    );
  };

  // Afficher les détails d'une note
  const handleShowDetails = (note: NoteFrais) => {
    setSelectedNote(note);
    setDetailDialogOpen(true);
  };

  // Fonction pour obtenir la couleur du badge en fonction du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_attente':
        return 'bg-yellow-500 text-white';
      case 'valide':
        return 'bg-green-500 text-white';
      case 'rejete':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Fonction pour formater le statut pour l'affichage
  const formatStatus = (status: string) => {
    switch (status) {
      case 'en_attente':
        return 'En attente';
      case 'valide':
        return 'Validée';
      case 'rejete':
        return 'Rejetée';
      default:
        return status;
    }
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
