
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Layout from '../components/Layout';
import { useToast } from '../hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import the components
import InspectionFilters from '../components/inspections/InspectionFilters';
import InspectionsTable from '../components/inspections/InspectionsTable';
import NewInspectionButton from '../components/inspections/NewInspectionDialog';
import InspectionDetails from '../components/inspections/InspectionDetails';
import RapportsList from '../components/inspections/RapportsList';
import NotesFraisOverview from '../components/inspections/NotesFraisOverview';

const Inspections = () => {
  const { inspections, dossiers, updateInspection } = useData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('tous');
  const [inspectionDetailsOpen, setInspectionDetailsOpen] = useState(false);
  const [selectedInspectionId, setSelectedInspectionId] = useState('');

  // Filtrer les inspections en fonction des critères de recherche
  const filteredInspections = inspections.filter(inspection => {
    const dossier = dossiers.find(d => d.id === inspection.dossierId);
    
    const matchesSearch = dossier 
      ? (dossier.operateurNom?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (inspection.lieu?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
      : false;
    
    const matchesStatus = statusFilter === 'tous' || inspection.resultat === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Fonction pour marquer une inspection comme conforme
  const handleMarkAsConforme = (id: string) => {
    updateInspection(id, { 
      resultat: 'conforme',
      recommandations: 'Inspection validée. Dossier conforme.'
    });
    toast({
      title: "Inspection validée",
      description: "L'inspection a été marquée comme conforme.",
    });
  };

  // Fonction pour marquer une inspection comme non-conforme
  const handleMarkAsNonConforme = (id: string) => {
    updateInspection(id, { 
      resultat: 'non_conforme',
      actionsCorrectives: 'Des actions correctives sont nécessaires.'
    });
    toast({
      title: "Inspection non-conforme",
      description: "L'inspection a été marquée comme non-conforme.",
    });
  };

  // Fonction pour afficher les détails d'une inspection
  const handleViewDetails = (id: string) => {
    setSelectedInspectionId(id);
    setInspectionDetailsOpen(true);
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-certif-blue">Responsable des missions</h1>
        <NewInspectionButton />
      </div>

      <Tabs defaultValue="inspections">
        <TabsList>
          <TabsTrigger value="inspections">Inspections</TabsTrigger>
          <TabsTrigger value="rapports">Rapports</TabsTrigger>
          <TabsTrigger value="frais">Notes de frais</TabsTrigger>
        </TabsList>

        <TabsContent value="inspections">
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <InspectionFilters 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />

            <InspectionsTable 
              inspections={filteredInspections}
              dossiers={dossiers}
              onViewDetails={handleViewDetails}
              onMarkAsConforme={handleMarkAsConforme}
              onMarkAsNonConforme={handleMarkAsNonConforme}
            />
          </div>
        </TabsContent>
      
        <TabsContent value="rapports">
          <RapportsList />
        </TabsContent>
      
        <TabsContent value="frais">
          <NotesFraisOverview />
        </TabsContent>
      </Tabs>
      
      {inspectionDetailsOpen && selectedInspectionId && (
        <InspectionDetails 
          isOpen={inspectionDetailsOpen}
          onClose={() => setInspectionDetailsOpen(false)}
          inspectionId={selectedInspectionId}
        />
      )}
    </Layout>
  );
};

export default Inspections;
