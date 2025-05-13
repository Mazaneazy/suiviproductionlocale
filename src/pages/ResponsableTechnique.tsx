
import React from 'react';
import Layout from '../components/Layout';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useResponsableTechniqueState } from '@/components/responsable-technique/state/useResponsableTechniqueState';
import ProgrammerInspectionDialog from '../components/responsable-technique/inspections/ProgrammerInspectionDialog';
import TabsNavigation from '@/components/responsable-technique/TabsNavigation';

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
  } = useResponsableTechniqueState();

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-certif-blue">Poste Responsable Technique</h1>
        <p className="text-gray-600 mt-2">
          Validation des documents, composition du pilote technique et gestion des inspections
        </p>
      </div>
      
      <Tabs defaultValue="dossiers" value={activeTab} onValueChange={setActiveTab}>
        <TabsNavigation 
          activeTab={activeTab} 
          selectedDossier={selectedDossier} 
        />
        
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
      
      {selectedDossier && (
        <ProgrammerInspectionDialog
          dossier={selectedDossier}
          open={inspectionDialogOpen}
          onOpenChange={setInspectionDialogOpen}
          onProgrammer={handleProgrammerInspection}
        />
      )}
    </Layout>
  );
};

export default ResponsableTechnique;
