
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import NotesFraisForm from '../components/responsable-technique/NotesFraisForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Helmet } from 'react-helmet';
import { useNotesFraisFormState } from '@/components/responsable-technique/notes-frais';

const CreateNoteFrais = () => {
  const navigate = useNavigate();
  const { dossierId } = useParams();
  const { getDossierById } = useData();
  
  // Récupérer le dossier si un ID est fourni
  const dossier = dossierId ? getDossierById(dossierId) : null;
  
  const handleNoteFraisCreated = () => {
    // Rediriger vers la page des notes de frais après la création
    navigate('/notes-frais');
  };
  
  // Utiliser le custom hook avec le dossier récupéré ou null
  const formState = useNotesFraisFormState(dossier || { id: '' } as any, handleNoteFraisCreated);

  return (
    <Layout>
      <Helmet>
        <title>Créer une note de frais | ANOR Certification</title>
      </Helmet>
      
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        
        <h1 className="text-3xl font-bold text-certif-blue">Création d'une note de frais</h1>
        <p className="text-gray-600 mt-2">
          Remplissez le formulaire ci-dessous pour créer une nouvelle note de frais
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <NotesFraisForm 
          dossier={dossier} 
          onNoteFraisCreated={handleNoteFraisCreated}
        />
      </div>
    </Layout>
  );
};

export default CreateNoteFrais;
