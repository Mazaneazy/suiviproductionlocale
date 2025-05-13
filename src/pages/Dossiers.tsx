import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useData } from '../contexts/DataContext';
import DossiersTable from '../components/dossiers/DossiersTable';
import DossierDialogContent from './dossiers/DossierDialogContent.tsx'; // ou .jsx
import DossierFilters from '../components/dossiers/DossierFilters';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Dossiers = () => {
  const { dossiers, searchTerm, setSearchTerm, statusFilter, setStatusFilter } = useData();
  const navigate = useNavigate();
  
  const filteredDossiers = dossiers.filter(dossier => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearchTerm =
      dossier.operateurNom.toLowerCase().includes(searchTermLower) ||
      dossier.promoteurNom.toLowerCase().includes(searchTermLower) ||
      dossier.reference.toLowerCase().includes(searchTermLower);

    const matchesStatus = statusFilter === 'all' || dossier.status === statusFilter;

    return matchesSearchTerm && matchesStatus;
  });

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-certif-blue">Dossiers</h1>
        <Button onClick={() => navigate('/dossiers/add')}>
          <Plus className="mr-2 h-5 w-5" />
          Ajouter un dossier
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <DossierFilters 
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={setSearchTerm}
          onStatusChange={setStatusFilter}
        />
        <DossiersTable 
          dossiers={filteredDossiers}
        />
      </div>
      
    </Layout>
  );
};

export default Dossiers;
