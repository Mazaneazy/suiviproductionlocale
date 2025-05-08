
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { PlusCircle } from 'lucide-react';

// Import the new components
import InspectionFilters from '../components/inspections/InspectionFilters';
import InspectionsTable from '../components/inspections/InspectionsTable';
import NewInspectionDialog from '../components/inspections/NewInspectionDialog';
import InspectionDetails from '../components/inspections/InspectionDetails';

const Inspections = () => {
  const { inspections, dossiers, addInspection, updateInspection } = useData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('tous');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inspectionDetailsOpen, setInspectionDetailsOpen] = useState(false);
  const [selectedInspectionId, setSelectedInspectionId] = useState('');

  // Filtrer les inspections en fonction des critères de recherche
  const filteredInspections = inspections.filter(inspection => {
    const dossier = dossiers.find(d => d.id === inspection.dossierId);
    
    const matchesSearch = dossier 
      ? dossier.operateurNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inspection.lieu.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    
    const matchesStatus = statusFilter === 'tous' || inspection.resultat === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Fonction pour ajouter une nouvelle inspection
  const handleAddInspection = (newInspection: any) => {
    addInspection(newInspection);
    toast({
      title: "Inspection programmée",
      description: "L'inspection a été programmée avec succès.",
    });
    setDialogOpen(false);
  };

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
        <h1 className="text-3xl font-bold text-certif-blue">Inspections</h1>
        <Button 
          onClick={() => setDialogOpen(true)} 
          className="bg-certif-blue hover:bg-certif-blue/90"
        >
          <PlusCircle className="mr-2" size={16} />
          Nouvelle inspection
        </Button>
      </div>

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
      
      <NewInspectionDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        dossiers={dossiers}
        onAddInspection={handleAddInspection}
      />
      
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
