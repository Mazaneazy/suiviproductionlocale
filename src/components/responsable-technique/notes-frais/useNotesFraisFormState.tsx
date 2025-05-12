
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Dossier, NoteFrais } from '@/types';

export const useNotesFraisFormState = (dossier, onNoteFraisCreated) => {
  const { toast } = useToast();
  const [newNoteFrais, setNewNoteFrais] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    montant: 0,
    fraisGestion: 50000,
    fraisInspection: 75000,
    fraisAnalyses: 0,
    fraisSurveillance: 40000
  });
  
  const [selectedParametres, setSelectedParametres] = useState([]);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [total, setTotal] = useState(0);
  const [fraisGestion, setFraisGestion] = useState(50000);
  const [fraisInspection, setFraisInspection] = useState(75000);
  const [fraisSurveillance, setFraisSurveillance] = useState(40000);
  const [totalPrix, setTotalPrix] = useState(0);
  
  const fileInputRef = useRef(null);
  
  // Calculate the total whenever any of the frais values change
  useEffect(() => {
    const newTotal = fraisGestion + fraisInspection + totalPrix + fraisSurveillance;
    setTotal(newTotal);
  }, [fraisGestion, fraisInspection, totalPrix, fraisSurveillance]);
  
  // Handler for input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'fraisGestion' || name === 'fraisInspection' || name === 'fraisSurveillance') {
      const numValue = parseInt(value, 10) || 0;
      if (name === 'fraisGestion') setFraisGestion(numValue);
      if (name === 'fraisInspection') setFraisInspection(numValue);
      if (name === 'fraisSurveillance') setFraisSurveillance(numValue);
      
      setNewNoteFrais({
        ...newNoteFrais,
        [name]: numValue
      });
    } else {
      setNewNoteFrais({
        ...newNoteFrais,
        [name]: value
      });
    }
  };
  
  // Handler for file changes
  const handleFileChange = (e) => {
    // Implementation for file handling
  };
  
  // Toggle a parameter selection
  const toggleParametre = (parametre) => {
    setSelectedParametres(prev => {
      if (prev.includes(parametre)) {
        return prev.filter(p => p !== parametre);
      } else {
        return [...prev, parametre];
      }
    });
  };
  
  // Reset form
  const handleReset = () => {
    setNewNoteFrais({
      date: new Date().toISOString().split('T')[0],
      description: '',
      montant: 0,
      fraisGestion: 50000,
      fraisInspection: 75000,
      fraisAnalyses: 0,
      fraisSurveillance: 40000
    });
    setSelectedParametres([]);
    setDescription('');
    setFraisGestion(50000);
    setFraisInspection(75000);
    setFraisSurveillance(40000);
    setTotalPrix(0);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Build note de frais object
      const noteFrais = {
        dossierId: dossier.id,
        inspecteurId: 'user123', // Should come from auth
        date: newNoteFrais.date,
        dateCreation: new Date().toISOString(),
        description: description,
        montant: total,
        status: 'en_attente',
        acquitte: false,
        fraisGestion,
        fraisInspection,
        fraisAnalyses: totalPrix,
        fraisSurveillance,
        parametresAnalyse: selectedParametres,
      };
      
      // In a real app we'd save this to a database
      console.log("Note de frais à enregistrer:", noteFrais);
      
      toast({
        title: "Note de frais créée",
        description: "La note de frais a été créée avec succès",
      });
      
      handleReset();
      onNoteFraisCreated();
    } catch (error) {
      console.error("Erreur lors de la création de la note de frais", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de la création de la note de frais",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    newNoteFrais,
    setNewNoteFrais,
    total,
    handleInputChange,
    handleFileChange,
    handleReset,
    handleSubmit,
    selectedParametres,
    setSelectedParametres,
    fraisGestion,
    fraisInspection,
    fraisSurveillance,
    totalPrix,
    description,
    setDescription,
    isSubmitting,
    setFraisGestion,
    setFraisInspection,
    setFraisSurveillance,
    fileInputRef,
    toggleParametre
  };
};

export default useNotesFraisFormState;
