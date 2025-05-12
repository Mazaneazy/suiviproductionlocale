
import { useState, useCallback, FormEvent, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { NoteFrais, Dossier } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useParametresEvaluation } from '@/hooks/useParametresEvaluation';
import { supabase } from '@/lib/supabase';

export const useNotesFraisFormState = (dossier: Dossier | null, onNoteFraisCreated: () => void) => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
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

    // Réinitialiser aussi les paramètres d'analyse
    setSelectedParametres([]);
  }, [dossier, currentUser, setSelectedParametres]);

  // Soumettre le formulaire
  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
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
      const noteFraisComplete = {
        dossier_id: newNoteFrais.dossierId,
        inspecteur_id: newNoteFrais.inspecteurId,
        date: new Date().toISOString(),
        date_creation: new Date().toISOString(),
        montant: total,
        description: description || `Note de frais - ${new Date().toLocaleDateString()}`,
        status: 'en_attente',
        acquitte: false,
        frais_gestion: fraisGestion,
        frais_inspection: fraisInspection,
        frais_analyses: totalPrix,
        frais_surveillance: fraisSurveillance,
        commentaire: newNoteFrais.commentaire || '',
        parametres_analyse: selectedParametres
      };

      // Ajouter la note de frais dans Supabase
      const { error } = await supabase
        .from('notes_frais')
        .insert(noteFraisComplete);
        
      if (error) {
        throw error;
      }
      
      // Ajouter à l'historique du dossier
      if (dossier?.id) {
        // Get current historique
        const { data: dossierData } = await supabase
          .from('dossiers')
          .select('historique')
          .eq('id', dossier.id)
          .single();
          
        const historique = dossierData?.historique || [];
        
        const newHistorique = [
          ...historique,
          {
            id: crypto.randomUUID(),
            dossierId: dossier.id,
            date: new Date().toISOString(),
            action: 'Note de frais créée',
            responsable: currentUser?.id || 'Système',
            commentaire: `Note de frais pour un montant total de ${total} FCFA`
          }
        ];
        
        await supabase
          .from('dossiers')
          .update({ historique: newHistorique })
          .eq('id', dossier.id);
      }
      
      toast({
        title: "Note de frais créée",
        description: "La note de frais a été créée avec succès",
      });
      
      // Réinitialiser et notifier
      handleReset();
      onNoteFraisCreated();
    } catch (error: any) {
      console.error("Erreur lors de la création de la note de frais:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création de la note de frais",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [newNoteFrais, total, toast, handleReset, onNoteFraisCreated, selectedParametres, description, fraisGestion, fraisInspection, totalPrix, fraisSurveillance, dossier, currentUser, setSelectedParametres]);

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
