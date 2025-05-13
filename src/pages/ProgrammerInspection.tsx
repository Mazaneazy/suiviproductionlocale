
import React from 'react';
import Layout from '../components/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Inspection } from '@/types';
import { useToast } from '@/hooks/use-toast';
import ProgrammerInspectionForm from '@/components/inspections/ProgrammerInspectionForm';

const ProgrammerInspection = () => {
  const navigate = useNavigate();
  const { dossierId } = useParams();
  const { dossiers, addInspection } = useData();
  const { toast } = useToast();
  
  const dossier = dossierId 
    ? dossiers.find(d => d.id === dossierId)
    : undefined;
    
  const handleSuccess = (inspection: Omit<Inspection, 'id'>) => {
    addInspection(inspection);
    
    toast({
      title: "Inspection programmée",
      description: `L'inspection a été programmée pour le ${new Date(inspection.dateInspection).toLocaleDateString()}`,
    });
    
    navigate(`/responsable-technique`);
  };
  
  if (!dossier) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-xl font-semibold mb-2">Dossier introuvable</h2>
          <Button onClick={() => navigate('/responsable-technique')}>
            Retour
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-certif-blue">Programmer une inspection</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate('/responsable-technique')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">
          Dossier: {dossier.operateurNom} - {dossier.typeProduit}
        </h2>
        
        <ProgrammerInspectionForm 
          dossierId={dossierId || ''} 
          onSuccess={handleSuccess} 
        />
      </div>
    </Layout>
  );
};

export default ProgrammerInspection;
