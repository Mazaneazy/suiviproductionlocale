
import React from 'react';
import Layout from '../components/Layout';
import AccueilForm from '../components/acceuil/AccueilForm';

const Accueil = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-certif-blue">Poste d'Accueil</h1>
        <p className="text-gray-600 mt-2">
          Réception et enregistrement des demandes de certification
        </p>
        <p className="text-sm text-certif-blue mt-1">
          Collectez toutes les informations relatives à la demande de certification et téléchargez les documents requis.
        </p>
      </div>
      <AccueilForm />
    </Layout>
  );
};

export default Accueil;
