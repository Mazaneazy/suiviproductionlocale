
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/DataContext';
import { useParametresEvaluation } from '@/hooks/useParametresEvaluation';
import { Dossier } from '@/types';

export const useNotesFraisForm = (dossier: Dossier, onNoteFraisCreated: () => void) => {
  const { toast } = useToast();
  const { addNoteFrais } = useData();
  
  const {
    parametres,
    selectedParametres,
    totalPrix,
    addParametre,
    removeParametre,
    toggleParametre
  } = useParametresEvaluation(dossier.id);
  
  const [fraisGestion, setFraisGestion] = useState(50000);
  const [fraisInspection, setFraisInspection] = useState(75000);
  const [fraisSurveillance, setFraisSurveillance] = useState(40000);
  const [total, setTotal] = useState(0);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculer le total
  useEffect(() => {
    const newTotal = totalPrix + fraisGestion + fraisInspection + fraisSurveillance;
    setTotal(newTotal);
  }, [totalPrix, fraisGestion, fraisInspection, fraisSurveillance]);
  
  const handleSubmit = (e: React.FormEvent) => {
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
      const newNoteFrais = {
        dossier_id: dossier.id,
        inspecteur_id: 'resp_technique',
        date: new Date().toISOString().split('T')[0],
        date_creation: new Date().toISOString(),
        description: description || `Note de frais pour le dossier ${dossier.operateurNom || dossier.operateur_nom}`,
        montant: total,
        status: 'en_attente' as const,
        parametres_analyse: selectedParametres,
        frais_gestion: fraisGestion,
        frais_inspection: fraisInspection,
        frais_analyses: totalPrix,
        frais_surveillance: fraisSurveillance,
        acquitte: false,
        notification_envoyee: false,
        operateur_notifie: false
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
    handleSubmit
  };
};
