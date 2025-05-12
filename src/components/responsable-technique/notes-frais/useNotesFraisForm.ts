
import { useState, useEffect, FormEvent } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/DataContext';
import { useParametresEvaluation } from '@/hooks/useParametresEvaluation';
import { Dossier, NoteFrais } from '@/types';

export const useNotesFraisForm = (dossier: Dossier, onNoteFraisCreated: () => void) => {
  const { toast } = useToast();
  const { addNoteFrais } = useData();
  
  const {
    parametres,
    selectedParametres,
    totalPrix,
    addParametre,
    removeParametre,
    toggleParametre,
    parametresOptions
  } = useParametresEvaluation(dossier.id);
  
  const [fraisGestion, setFraisGestion] = useState(50000);
  const [fraisInspection, setFraisInspection] = useState(75000);
  const [fraisSurveillance, setFraisSurveillance] = useState(40000);
  const [total, setTotal] = useState(0);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  // Calculer le total
  useEffect(() => {
    const newTotal = totalPrix + fraisGestion + fraisInspection + fraisSurveillance;
    setTotal(newTotal);
  }, [totalPrix, fraisGestion, fraisInspection, fraisSurveillance]);
  
  // Gérer les modifications de fichier
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

  // Gérer les modifications d'input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'description') {
      setDescription(value);
    }
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (selectedParametres.length === 0) {
      toast({
        variant: "destructive",
        title: "Aucun paramètre sélectionné",
        description: "Veuillez sélectionner au moins un paramètre à évaluer.",
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Créer la note de frais
      const newNoteFrais: Omit<NoteFrais, 'id'> = {
        dossierId: dossier.id,
        inspecteurId: 'resp_technique',
        date: new Date().toISOString().split('T')[0],
        dateCreation: new Date().toISOString(),
        description: description || `Note de frais pour le dossier ${dossier.operateurNom}`,
        montant: total,
        status: 'en_attente',
        parametresAnalyse: selectedParametres,
        fraisGestion,
        fraisInspection,
        fraisAnalyses: totalPrix,
        fraisSurveillance,
        acquitte: false
      };
      
      addNoteFrais(newNoteFrais);
      
      toast({
        title: "Note de frais créée",
        description: "La note de frais a été créée avec succès. Elle sera transmise au Directeur pour validation.",
      });
      
      onNoteFraisCreated();
    } catch (error) {
      console.error("Erreur lors de la création de la note de frais:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la note de frais.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    parametres,
    selectedParametres,
    totalPrix,
    addParametre,
    removeParametre,
    toggleParametre,
    parametresOptions,
    fraisGestion,
    setFraisGestion,
    fraisInspection,
    setFraisInspection,
    fraisSurveillance,
    setFraisSurveillance,
    total,
    description,
    setDescription,
    isSubmitting,
    handleSubmit,
    handleInputChange,
    handleFileChange,
    uploadedFile
  };
};
