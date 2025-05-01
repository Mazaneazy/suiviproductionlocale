
import { useState, useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import { Certificat, Dossier, Inspection } from '@/types';

export const useResultats = () => {
  const { certificats, dossiers, inspections, updateCertificat } = useData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('tous');
  
  // Obtenir les dossiers éligibles pour la certification (avec inspection conforme)
  const dossiersEligibles = useMemo(() => dossiers
    .filter(dossier => {
      const dossierInspections = inspections.filter(i => i.dossierId === dossier.id);
      const hasInspection = dossierInspections.length > 0;
      const hasCertificat = certificats.some(c => c.dossierId === dossier.id && c.status === 'actif');
      
      return hasInspection && !hasCertificat && dossier.status !== 'rejete';
    }), [dossiers, inspections, certificats]);

  // Filtrer les certificats en fonction des critères de recherche
  const filteredCertificats = useMemo(() => certificats.filter(certificat => {
    const matchesSearch = 
      certificat.entreprise.toLowerCase().includes(searchTerm.toLowerCase()) ||
      certificat.produit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      certificat.numero.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'tous' || certificat.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }), [certificats, searchTerm, statusFilter]);

  // Fonction pour suspendre un certificat
  const handleSuspendCertificat = (id: string) => {
    updateCertificat(id, { status: 'suspendu' });
    toast({
      title: "Document suspendu",
      description: "Le document a été suspendu avec succès.",
    });
  };

  // Fonction pour réactiver un certificat suspendu
  const handleReactivateCertificat = (id: string) => {
    updateCertificat(id, { status: 'actif' });
    toast({
      title: "Document réactivé",
      description: "Le document a été réactivé avec succès.",
    });
  };

  // Fonction pour simuler le téléchargement d'un certificat
  const handleDownloadCertificat = (certificat: Certificat) => {
    toast({
      title: "Téléchargement du document",
      description: `Le document ${certificat.numero} a été téléchargé.`,
    });
  };

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    dossiersEligibles,
    filteredCertificats,
    handleSuspendCertificat,
    handleReactivateCertificat,
    handleDownloadCertificat
  };
};
