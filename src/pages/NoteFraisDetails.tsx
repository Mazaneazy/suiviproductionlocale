
import React from 'react';
import Layout from '../components/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import NotesFraisDetails from '../components/notes-frais/NotesFraisDetails';
import { useNotesFraisUtils } from '@/hooks/notes-frais/useNotesFraisUtils';

const NoteFraisDetails = () => {
  const navigate = useNavigate();
  const { noteId } = useParams();
  const { notesFrais, dossiers } = useData();
  const { getStatusColor, formatStatus, calculerTotal } = useNotesFraisUtils();
  
  const selectedNote = noteId 
    ? notesFrais.find(note => note.id === noteId)
    : null;
  
  if (!selectedNote) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-xl font-semibold mb-2">Note de frais introuvable</h2>
          <Button onClick={() => navigate('/notes-frais')}>
            Retour à la liste des notes de frais
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-certif-blue">Détails de la note de frais</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate('/notes-frais')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <NotesFraisDetails
          note={selectedNote}
          dossiers={dossiers}
          getStatusColor={getStatusColor}
          formatStatus={formatStatus}
          calculerTotal={calculerTotal}
        />
      </div>
    </Layout>
  );
};

export default NoteFraisDetails;
