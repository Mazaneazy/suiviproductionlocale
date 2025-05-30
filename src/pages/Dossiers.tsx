
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Layout from '../components/Layout';
import { useToast } from '../hooks/use-toast';
import { Dossier } from '../types';
import AddDossierButton from '../components/dossiers/AddDossierDialog';
import DossierFilters from '../components/dossiers/DossierFilters';
import DossiersTable from '../components/dossiers/DossiersTable';

const Dossiers = () => {
  const { dossiers } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('tous');

  // Filtrer les dossiers en fonction des critères de recherche
  const filteredDossiers = dossiers.filter(dossier => {
    const matchesSearch = 
      (dossier.operateurNom?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (dossier.typeProduit?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (dossier.responsable?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesStatus = statusFilter === 'tous' || dossier.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  console.log("Total dossiers:", dossiers.length);
  console.log("Filtered dossiers:", filteredDossiers.length);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-certif-blue">Transmission dossiers</h1>
        <AddDossierButton />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <DossierFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        <DossiersTable dossiers={filteredDossiers} />
      </div>
    </Layout>
  );
};

export default Dossiers;
