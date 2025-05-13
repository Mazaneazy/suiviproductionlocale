
import React from 'react';
import Layout from '../components/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ProgrammerInspectionForm from '@/components/inspections/ProgrammerInspectionForm';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';

const AddInspection = () => {
  const navigate = useNavigate();
  const { dossierId } = useParams<{ dossierId?: string }>();
  const { toast } = useToast();
  const { getDossierById } = useData();
  
  const dossier = dossierId ? getDossierById(dossierId) : null;
  
  const handleSuccess = () => {
    toast({
      title: "Inspection programmée",
      description: "L'inspection a été programmée avec succès."
    });
    navigate('/inspections');
  };
  
  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-certif-blue">
          Programmer une inspection
          {dossier && ` pour ${dossier.operateurNom}`}
        </h1>
        <Button 
          variant="outline" 
          onClick={() => navigate('/inspections')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        {dossierId ? (
          <ProgrammerInspectionForm 
            dossierId={dossierId} 
            onSuccess={handleSuccess}
          />
        ) : (
          <div className="p-4 border border-yellow-200 bg-yellow-50 text-yellow-700 rounded-md">
            <p>Veuillez sélectionner un dossier pour programmer une inspection.</p>
            <Button 
              onClick={() => navigate('/dossiers')} 
              variant="outline" 
              className="mt-4"
            >
              Voir les dossiers
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AddInspection;
