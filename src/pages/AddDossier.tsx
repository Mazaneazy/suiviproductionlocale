
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Dossier } from '@/types';
import DossierDialogContent from './dossiers/DossierDialogContent';

const AddDossier = () => {
  const navigate = useNavigate();
  const { addDossier } = useData();
  
  const [newDossier, setNewDossier] = useState<Omit<Dossier, 'id'>>({
    operateurNom: '',
    promoteurNom: '',
    telephone: '',
    typeProduit: '',
    reference: '',
    dateTransmission: new Date().toISOString(),
    status: 'en_attente',
    delai: 30,
    dateButoir: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  });
  
  const [latestDossierId, setLatestDossierId] = useState<string>();
  
  const handleSubmit = () => {
    const dossierId = addDossier(newDossier);
    setLatestDossierId(dossierId);
    navigate('/dossiers');
  };
  
  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-certif-blue">Ajouter un nouveau dossier</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate('/dossiers')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <DossierDialogContent
          newDossier={newDossier}
          setNewDossier={setNewDossier}
          onSubmit={handleSubmit}
          onClose={() => navigate('/dossiers')}
          dossierIdAfterSubmit={latestDossierId}
        />
      </div>
    </Layout>
  );
};

export default AddDossier;
