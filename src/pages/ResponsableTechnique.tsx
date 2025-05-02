
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DossiersTechTable from '../components/responsable-technique/DossiersTechTable';
import DossierDetailPanel from '../components/responsable-technique/DossierDetailPanel';
import NotesFraisForm from '../components/responsable-technique/NotesFraisForm';

const ResponsableTechnique = () => {
  const { dossiers, getDocumentsByDossierId } = useData();
  const { toast } = useToast();
  const [selectedDossierId, setSelectedDossierId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dossiers');
  
  // Show both complete and pending dossiers for the Responsable Technique
  const filteredDossiers = dossiers.filter(
    dossier => dossier.status === 'complet' || dossier.status === 'en_attente'
  );
  
  const selectedDossier = selectedDossierId 
    ? dossiers.find(d => d.id === selectedDossierId) 
    : null;
    
  const documents = selectedDossierId 
    ? getDocumentsByDossierId(selectedDossierId)
    : [];
    
  const handleSelectDossier = (id: string) => {
    setSelectedDossierId(id);
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-certif-blue">Poste Responsable Technique</h1>
        <p className="text-gray-600 mt-2">
          Validation des documents et élaboration des notes de frais
        </p>
      </div>
      
      <Tabs defaultValue="dossiers" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="dossiers">Dossiers à traiter</TabsTrigger>
          <TabsTrigger value="notesfrais" disabled={!selectedDossier}>Élaboration note de frais</TabsTrigger>
        </TabsList>
        
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
                      setActiveTab('notesfrais');
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
