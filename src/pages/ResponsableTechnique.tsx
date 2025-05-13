
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useData } from '../contexts/DataContext';
import { useToast } from '../hooks/use-toast';
import { useRapportSubmission } from '../hooks/useRapportSubmission';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RapportInspection, ComiteTechnique, Inspection } from '@/types';
import ProgrammerInspectionDialog from '../components/responsable-technique/inspections/ProgrammerInspectionDialog';

// Import tab components
import DossiersTab from '../components/responsable-technique/tabs/DossiersTab';
import ComiteTab from '../components/responsable-technique/tabs/ComiteTab';
import FraisTab from '../components/responsable-technique/tabs/FraisTab';
import InspectionsTab from '../components/responsable-technique/tabs/InspectionsTab';
import RapportsTab from '../components/responsable-technique/tabs/RapportsTab';
import NotesFraisTab from '../components/responsable-technique/tabs/NotesFraisTab';
import ChecklistTab from '../components/responsable-technique/tabs/ChecklistTab';
import AvisDecisionTab from '../components/responsable-technique/tabs/AvisDecisionTab';

const ResponsableTechnique = () => {
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

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-certif-blue">Poste Responsable Technique</h1>
        <p className="text-gray-600 mt-2">
          Validation des documents, composition du pilote technique et gestion des inspections
        </p>
      </div>
      
      <Tabs defaultValue="dossiers" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="dossiers">Dossiers à traiter</TabsTrigger>
          <TabsTrigger value="comite" disabled={!selectedDossier}>Pilote technique</TabsTrigger>
          <TabsTrigger value="checklist" disabled={!selectedDossier}>Checklist d'inspection</TabsTrigger>
          <TabsTrigger value="frais" disabled={!selectedDossier}>Validation des frais</TabsTrigger>
          <TabsTrigger value="inspections" disabled={!selectedDossier}>Inspections</TabsTrigger>
          <TabsTrigger value="rapports">Rapports</TabsTrigger>
          <TabsTrigger value="avis" disabled={!selectedDossier}>Avis de décision</TabsTrigger>
          <TabsTrigger value="notesfrais" disabled={!selectedDossier}>Note de frais</TabsTrigger>
        </TabsList>
        
        {/* Tab: Dossiers */}
        <TabsContent value="dossiers" className="space-y-6">
          <DossiersTab
            dossiers={dossiers}
            selectedDossierId={selectedDossierId}
            onSelectDossier={handleSelectDossier}
            selectedDossier={selectedDossier}
            documents={documents}
            onValidationComplete={handleValidationComplete}
          />
        </TabsContent>
        
        {/* Tab: Pilote technique */}
        <TabsContent value="comite">
          <ComiteTab 
            dossier={selectedDossier} 
            onSaveComite={handleSaveComite} 
          />
        </TabsContent>
        
        {/* Tab: Checklist d'inspection */}
        <TabsContent value="checklist">
          <ChecklistTab
            dossier={selectedDossier}
            onChecklistSubmitted={handleChecklistSubmitted}
          />
        </TabsContent>
        
        {/* Tab: Validation des frais */}
        <TabsContent value="frais">
          <FraisTab 
            notesFrais={notesFrais} 
            onValidate={handleValidateFrais} 
          />
        </TabsContent>
        
        {/* Tab: Inspections */}
        <TabsContent value="inspections">
          <InspectionsTab
            dossier={selectedDossier}
            inspections={dossierInspections}
            selectedInspection={selectedInspection}
            setSelectedInspection={setSelectedInspection}
            onOpenInspectionDialog={() => setInspectionDialogOpen(true)}
            onSubmitRapport={handleSubmitRapport}
          />
          
          {selectedDossier && (
            <ProgrammerInspectionDialog
              dossier={selectedDossier}
              open={inspectionDialogOpen}
              onOpenChange={setInspectionDialogOpen}
              onProgrammer={handleProgrammerInspection}
            />
          )}
        </TabsContent>
        
        {/* Tab: Rapports */}
        <TabsContent value="rapports">
          <RapportsTab 
            rapports={[]} // Dans un vrai système, nous récupérerions les rapports depuis l'API 
            onViewRapport={handleViewRapport} 
          />
        </TabsContent>
        
        {/* Tab: Avis de décision */}
        <TabsContent value="avis">
          <AvisDecisionTab
            dossier={selectedDossier}
            rapports={[]} // In a real system, we would get the reports from the API
            onAvisSubmitted={handleAvisSubmitted}
          />
        </TabsContent>
        
        {/* Tab: Notes de frais */}
        <TabsContent value="notesfrais">
          <NotesFraisTab 
            dossier={selectedDossier} 
            onNoteFraisCreated={handleNoteFraisCreated} 
          />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default ResponsableTechnique;
