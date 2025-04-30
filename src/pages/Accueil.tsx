
import React from 'react';
import Layout from '../components/Layout';
import AccueilForm from '../components/acceuil/AccueilForm';

const Accueil = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-certif-blue">Poste d'Accueil</h1>
        <p className="text-gray-600 mt-2">
          Réception des dossiers de demande de certification
        </p>
      </div>
      <AccueilForm />
    </Layout>
  );
};

export default Accueil;
