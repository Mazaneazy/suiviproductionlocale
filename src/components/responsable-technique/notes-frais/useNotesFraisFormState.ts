
import { useState, useCallback, FormEvent, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { NoteFrais, Dossier } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useData } from '@/contexts/DataContext';
import { useParametresEvaluation } from '@/hooks/useParametresEvaluation';

export const useNotesFraisFormState = (dossier: Dossier | null, onNoteFraisCreated: () => void) => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { addNoteFrais } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // For ParametresAnalyseForm
  const {
    selectedParametres = [],
    toggleParametre,
    totalPrix = 75000,
    setSelectedParametres
  } = useParametresEvaluation(dossier?.id || '');
  
  // Individual state items for direct form control
  const [fraisGestion, setFraisGestion] = useState(50000);
  const [fraisInspection, setFraisInspection] = useState(100000);
  const [fraisSurveillance, setFraisSurveillance] = useState(50000);
  const [description, setDescription] = useState('');
  
  // Combined state for full note
  const [newNoteFrais, setNewNoteFrais] = useState<Partial<NoteFrais>>({
    description: '',
    montant: 0,
    date: new Date().toISOString().split('T')[0],
    fraisGestion: fraisGestion,
    fraisInspection: fraisInspection,
    fraisAnalyses: 75000,
    fraisSurveillance: fraisSurveillance,
    status: 'en_attente',
    acquitte: false,
    dossierId: dossier?.id || '',
    inspecteurId: currentUser?.id || '',
    commentaire: '',
    dateCreation: new Date().toISOString(),
  });

  // Calculer le total des frais
  const total = 
    fraisGestion + 
    fraisInspection + 
    totalPrix + 
    fraisSurveillance;

  // Gérer le changement des champs input
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' ? parseFloat(value) || 0 : value;
    
    // Update the specific state if it's one of our tracked fields
    if (name === 'description') {
      setDescription(value);
    }
    
    setNewNoteFrais(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  }, []);

  // Gérer le changement de fichiers
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Logique pour gérer les fichiers si nécessaire
    console.log("Fichiers sélectionnés:", e.target.files);
  }, []);

  // Réinitialiser le formulaire
  const handleReset = useCallback(() => {
    setFraisGestion(50000);
    setFraisInspection(100000);
    setFraisSurveillance(50000);
    setDescription('');
    
    setNewNoteFrais({
      description: '',
      montant: 0,
      date: new Date().toISOString().split('T')[0],
      fraisGestion: 50000,
      fraisInspection: 100000,
      fraisAnalyses: 75000,
      fraisSurveillance: 50000,
      status: 'en_attente',
      acquitte: false,
      dossierId: dossier?.id || '',
      inspecteurId: currentUser?.id || '',
      commentaire: '',
      dateCreation: new Date().toISOString(),
    });
  }, [dossier, currentUser]);

  // Soumettre le formulaire
  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!newNoteFrais.dossierId) {
      toast({
        title: "Erreur",
        description: "ID du dossier manquant",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Calculer le montant total
      const noteFraisComplete: NoteFrais = {
        ...newNoteFrais as NoteFrais,
        id: `frais-${Date.now()}`,
        montant: total,
        date: new Date().toISOString(),
        parametresAnalyse: selectedParametres,
      };

      // Ajouter la note de frais
      addNoteFrais(noteFraisComplete);
      
      toast({
        title: "Note de frais créée",
        description: "La note de frais a été créée avec succès",
      });
      
      // Réinitialiser et notifier
      handleReset();
      onNoteFraisCreated();
    } catch (error) {
      console.error("Erreur lors de la création de la note de frais:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la note de frais",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [newNoteFrais, total, addNoteFrais, toast, handleReset, onNoteFraisCreated, selectedParametres]);

  return {
    newNoteFrais,
    setNewNoteFrais,
    total,
    isLoading,
    handleInputChange,
    handleFileChange,
    handleReset,
    handleSubmit,
    selectedParametres,
    fraisGestion,
    fraisInspection,
    fraisSurveillance,
    description,
    setDescription,
    isSubmitting: isLoading,
    totalPrix,
    setFraisGestion,
    setFraisInspection,
    setFraisSurveillance,
    fileInputRef,
    toggleParametre,
    setSelectedParametres
  };
};
