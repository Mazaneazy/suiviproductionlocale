
import React from 'react';
import Layout from '../components/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import NotesFraisForm from '../components/notes-frais/NotesFraisForm';
import { useData } from '../contexts/DataContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const AddNoteFrais = () => {
  const navigate = useNavigate();
  const { dossierId } = useParams();
  const { dossiers } = useData();
  
  const selectedDossier = dossierId 
    ? dossiers.find(d => d.id === dossierId) 
    : undefined;
  
  const handleSuccess = () => {
    navigate('/notes-frais');
  };
  
  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-certif-blue">Ajouter une note de frais</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate('/notes-frais')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <NotesFraisForm 
          dossierId={dossierId}
          selectedDossier={selectedDossier}
          onSuccess={handleSuccess}
        />
      </div>
    </Layout>
  );
};

export default AddNoteFrais;
