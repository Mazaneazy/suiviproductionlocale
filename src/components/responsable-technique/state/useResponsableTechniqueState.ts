
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/DataContext';
import { useRapportSubmission } from '@/hooks/useRapportSubmission';
import { Dossier, ComiteTechnique, RapportInspection, Inspection } from '@/types';

export const useResponsableTechniqueState = () => {
  const { 
    dossiers, 
    getDocumentsByDossierId, 
    getNoteFraisByDossierId, 
    updateNoteFrais, 
    updateDossier, 
    inspections, 
    addInspection 
  } = useData();
  const { toast } = useToast();
  const { submitRapport } = useRapportSubmission();
  
  const [selectedDossierId, setSelectedDossierId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dossiers');
  const [inspectionDialogOpen, setInspectionDialogOpen] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [selectedRapport, setSelectedRapport] = useState<RapportInspection | null>(null);
  
  const selectedDossier = selectedDossierId 
    ? dossiers.find(d => d.id === selectedDossierId) 
    : null;
    
  const documents = selectedDossierId 
    ? getDocumentsByDossierId(selectedDossierId)
    : [];

  const notesFrais = selectedDossierId
    ? getNoteFraisByDossierId(selectedDossierId)
    : [];

  const dossierInspections = selectedDossierId
    ? inspections.filter(i => i.dossierId === selectedDossierId)
    : [];
    
  const handleSelectDossier = (id: string) => {
    setSelectedDossierId(id);
  };

  const handleSaveComite = (comite: ComiteTechnique) => {
    if (selectedDossierId) {
      updateDossier(selectedDossierId, { comiteTechnique: comite });
    }
  };

  const handleValidateFrais = (id: string) => {
    updateNoteFrais(id, { acquitte: true });
    toast({
      title: "Frais acquittés",
      description: "Les frais ont été marqués comme acquittés",
    });
  };

  const handleProgrammerInspection = (inspection: Omit<Inspection, 'id'>) => {
    addInspection(inspection);
    toast({
      title: "Inspection programmée",
      description: `L'inspection a été programmée pour le ${new Date(inspection.dateInspection).toLocaleDateString()}`,
    });
  };

  const handleSubmitRapport = (rapport: RapportInspection) => {
    submitRapport(rapport);
    
    // Simuler l'envoi de notifications
    setTimeout(() => {
      toast({
        title: "Rapport transmis",
        description: "Le rapport a été transmis au directeur d'évaluation",
      });
      setSelectedInspection(null);
    }, 1000);
  };

  const handleViewRapport = (rapport: RapportInspection) => {
    setSelectedRapport(rapport);
  };

  const handleValidationComplete = () => {
    setActiveTab('comite');
  };

  const handleNoteFraisCreated = () => {
    toast({
      title: "Note de frais créée",
      description: "La note de frais a été créée et transmise au directeur pour validation.",
    });
    setActiveTab('dossiers');
    setSelectedDossierId(null);
  };

  const handleChecklistSubmitted = () => {
    toast({
      title: "Checklist d'inspection soumise",
      description: "Le plan d'inspection et le plan d'échantillonnage ont été enregistrés.",
    });
  };

  const handleAvisSubmitted = () => {
    toast({
      title: "Avis de décision soumis",
      description: "L'avis de décision a été transmis au comité de validation.",
    });
  };

  return {
    selectedDossierId,
    activeTab,
    setActiveTab,
    inspectionDialogOpen,
    setInspectionDialogOpen,
    selectedInspection,
    setSelectedInspection,
    selectedRapport,
    selectedDossier,
    documents,
    notesFrais,
    dossierInspections,
    handleSelectDossier,
    handleSaveComite,
    handleValidateFrais,
    handleProgrammerInspection,
    handleSubmitRapport,
    handleViewRapport,
    handleValidationComplete,
    handleNoteFraisCreated,
    handleChecklistSubmitted,
    handleAvisSubmitted,
    dossiers
  };
};
