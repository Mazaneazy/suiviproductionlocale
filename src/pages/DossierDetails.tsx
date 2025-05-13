
import React from 'react';
import Layout from '../components/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import DossierDialogContent from '@/components/dossiers/details/DossierDialogContent';

const DossierDetails = () => {
  const navigate = useNavigate();
  const { dossierId } = useParams();
  const { dossiers, documents, inspections, certificats } = useData();
  
  const dossier = dossierId 
    ? dossiers.find(d => d.id === dossierId)
    : undefined;
    
  const dossierDocuments = dossierId
    ? documents.filter(doc => doc.dossierId === dossierId)
    : [];
    
  const dossierInspections = dossierId
    ? inspections.filter(i => i.dossierId === dossierId)
    : [];
    
  const dossierCertificat = dossierId
    ? certificats.find(cert => cert.dossierId === dossierId)
    : undefined;
  
  if (!dossier) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-xl font-semibold mb-2">Dossier introuvable</h2>
          <Button onClick={() => navigate('/dossiers')}>
            Retour à la liste des dossiers
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-certif-blue">Détails du dossier</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate('/dossiers')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm">
        <DossierDialogContent
          dossier={dossier}
          documents={dossierDocuments}
          inspections={dossierInspections}
          certificat={dossierCertificat}
          loadingDocuments={false}
        />
      </div>
    </Layout>
  );
};

export default DossierDetails;
