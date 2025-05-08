import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/use-toast';
import { useDocumentProcessing } from '../hooks/useDocumentProcessing';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DossiersTechTable from '../components/responsable-technique/DossiersTechTable';
import DossierDetailPanel from '../components/responsable-technique/DossierDetailPanel';
import NotesFraisForm from '../components/responsable-technique/NotesFraisForm';
import ComiteTechniqueForm from '../components/responsable-technique/comite/ComiteTechniqueForm';
import FraisValidationTable from '../components/responsable-technique/frais/FraisValidationTable';
import RapportsTable from '../components/responsable-technique/rapports/RapportsTable';
import RapportInspectionForm from '../components/responsable-technique/rapports/RapportInspectionForm';
import ProgrammerInspectionDialog from '../components/responsable-technique/inspections/ProgrammerInspectionDialog';
import { 
  Dossier, 
  ComiteTechnique, 
  Inspection,
  RapportInspection
} from '@/types';
import { 
  CalendarClock,
  FileUp,
  Users,
  Check,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ResponsableTechnique = () => {
  const { dossiers, getDocumentsByDossierId, getNoteFraisByDossierId, updateNoteFrais, updateDossier, inspections, addInspection } = useData();
  const { toast } = useToast();
  const { processAttachments } = useDocumentProcessing();
  
  const [selectedDossierId, setSelectedDossierId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dossiers');
  const [inspectionDialogOpen, setInspectionDialogOpen] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [selectedRapport, setSelectedRapport] = useState<RapportInspection | null>(null);
  
  const filteredDossiers = dossiers.filter(
    dossier => dossier.status === 'complet' || dossier.status === 'en_attente'
  );
  
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
    // Dans un vrai système, nous sauvegarderions le rapport dans la base de données
    console.log("Rapport soumis:", rapport);
    
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
    // Dans un vrai système, nous ouvririons un dialogue ou une page de détail
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-certif-blue">Poste Responsable Technique</h1>
        <p className="text-gray-600 mt-2">
          Validation des documents, composition du comité technique et gestion des inspections
        </p>
      </div>
      
      <Tabs defaultValue="dossiers" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="dossiers">Dossiers à traiter</TabsTrigger>
          <TabsTrigger value="comite" disabled={!selectedDossier}>Comité technique</TabsTrigger>
          <TabsTrigger value="frais" disabled={!selectedDossier}>Validation des frais</TabsTrigger>
          <TabsTrigger value="inspections" disabled={!selectedDossier}>Inspections</TabsTrigger>
          <TabsTrigger value="rapports" disabled={!selectedDossier}>Rapports</TabsTrigger>
          <TabsTrigger value="notesfrais" disabled={!selectedDossier}>Note de frais</TabsTrigger>
        </TabsList>
        
        {/* Tab: Dossiers */}
        <TabsContent value="dossiers" className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="grid md:grid-cols-12 gap-6">
              <div className="md:col-span-5 p-4 border-r border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Dossiers en attente</h2>
                <DossiersTechTable 
                  dossiers={filteredDossiers} 
                  onSelectDossier={handleSelectDossier}
                  selectedDossierId={selectedDossierId}
                />
              </div>
              
              <div className="md:col-span-7 p-4">
                {selectedDossier ? (
                  <DossierDetailPanel 
                    dossier={selectedDossier} 
                    documents={documents}
                    onValidationComplete={() => {
                      toast({
                        title: "Validation complétée",
                        description: "Le dossier a été validé et marqué comme complet.",
                      });
                      setActiveTab('comite');
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>Veuillez sélectionner un dossier pour voir les détails</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Tab: Comité technique */}
        <TabsContent value="comite">
          {selectedDossier && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-certif-blue" />
                Composition du comité technique
              </h2>
              <ComiteTechniqueForm 
                dossier={selectedDossier}
                onSave={handleSaveComite}
              />
            </div>
          )}
        </TabsContent>
        
        {/* Tab: Validation des frais */}
        <TabsContent value="frais">
          {selectedDossier && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Check className="h-5 w-5 mr-2 text-certif-blue" />
                Validation des frais acquittés
              </h2>
              <FraisValidationTable 
                frais={notesFrais}
                onValidate={handleValidateFrais}
              />
            </div>
          )}
        </TabsContent>
        
        {/* Tab: Inspections */}
        <TabsContent value="inspections">
          {selectedDossier && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold mb-0 flex items-center">
                  <CalendarClock className="h-5 w-5 mr-2 text-certif-blue" />
                  Gestion des inspections
                </h2>
                <Button 
                  onClick={() => setInspectionDialogOpen(true)}
                  className="bg-certif-blue hover:bg-certif-blue/90"
                >
                  <CalendarClock className="h-4 w-4 mr-2" />
                  Programmer une inspection
                </Button>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                {dossierInspections.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Inspections programmées</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {dossierInspections.map((inspection) => (
                        <Card key={inspection.id} className="border">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-md">Inspection {new Date(inspection.dateInspection).toLocaleDateString()}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2 text-sm">
                              <p><span className="font-medium">Lieu:</span> {inspection.lieu}</p>
                              <p><span className="font-medium">Inspecteurs:</span> {inspection.inspecteurs.join(', ')}</p>
                              <p><span className="font-medium">Statut:</span> {
                                inspection.resultat === 'conforme' ? 'Conforme' :
                                inspection.resultat === 'non_conforme' ? 'Non conforme' : 'En attente'
                              }</p>
                            </div>
                            
                            <div className="mt-4">
                              <Button 
                                variant="outline" 
                                className="w-full"
                                onClick={() => setSelectedInspection(inspection)}
                              >
                                <FileUp className="h-4 w-4 mr-2" />
                                Rédiger rapport
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarClock className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p>Aucune inspection programmée pour ce dossier</p>
                    <p className="text-sm mt-2">Cliquez sur "Programmer une inspection" pour commencer</p>
                  </div>
                )}
              </div>
              
              {selectedInspection && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium mb-4">Rapport d'inspection</h3>
                  <RapportInspectionForm 
                    dossier={selectedDossier}
                    inspection={selectedInspection}
                    onSubmit={handleSubmitRapport}
                  />
                </div>
              )}
              
              <ProgrammerInspectionDialog
                dossier={selectedDossier}
                open={inspectionDialogOpen}
                onOpenChange={setInspectionDialogOpen}
                onProgrammer={handleProgrammerInspection}
              />
            </div>
          )}
        </TabsContent>
        
        {/* Tab: Rapports */}
        <TabsContent value="rapports">
          {selectedDossier && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-certif-blue" />
                Rapports d'inspection et d'analyse
              </h2>
              
              {/* Dans un vrai système, nous récupérerions les rapports depuis l'API */}
              <RapportsTable 
                rapports={[]}
                onViewRapport={handleViewRapport}
              />
            </div>
          )}
        </TabsContent>
        
        {/* Tab: Notes de frais (existant) */}
        <TabsContent value="notesfrais">
          {selectedDossier && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Élaboration de la note de frais</h2>
              <NotesFraisForm 
                dossier={selectedDossier}
                onNoteFraisCreated={() => {
                  toast({
                    title: "Note de frais créée",
                    description: "La note de frais a été créée et transmise au directeur pour validation.",
                  });
                  setActiveTab('dossiers');
                  setSelectedDossierId(null);
                }}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default ResponsableTechnique;
