
import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { NoteFrais } from '@/types';

export const useNotesFraisState = () => {
  const { notesFrais, dossiers, addNoteFrais, updateNoteFrais } = useData();
  const { currentUser } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('tous');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<NoteFrais | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

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

  return {
    notesFrais,
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
    currentUser,
  };
};
