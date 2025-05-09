
import React from 'react';
import Layout from '../components/Layout';
import AccueilForm from '../components/acceuil/AccueilForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const Accueil = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-certif-blue">Chargé de clientèle</h1>
        <p className="text-gray-600 mt-2">
          Réception et enregistrement des demandes de certification
        </p>
        <Alert variant="info" className="bg-blue-50 text-blue-800 border-blue-200 mt-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Collectez toutes les informations relatives à la demande de certification et téléchargez les documents requis.
            Assurez-vous que le nom de l'entreprise est unique pour éviter les doublons.
          </AlertDescription>
        </Alert>
      </div>
      <AccueilForm />
    </Layout>
  );
};

export default Accueil;
