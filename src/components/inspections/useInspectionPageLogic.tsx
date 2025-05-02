
import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';

export const useInspectionPageLogic = () => {
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
      ? dossier.operateurNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inspection.lieu.toLowerCase().includes(searchTerm.toLowerCase())
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

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredInspections,
    inspectionDetailsOpen,
    setInspectionDetailsOpen,
    selectedInspectionId,
    handleMarkAsConforme,
    handleMarkAsNonConforme,
    handleViewDetails,
  };
};
