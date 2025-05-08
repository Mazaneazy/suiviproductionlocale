
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import EntrepriseInfoForm from './EntrepriseInfoForm';
import DocumentsSection from './DocumentsSection';
import FormFooter from './FormFooter';
import { useDossierForm } from './useDossierForm';

const AccueilForm = () => {
  const {
    entreprise,
    setEntreprise,
    promoteur,
    setPromoteur,
    telephone,
    setTelephone,
    produits,
    setProduits,
    documents,
    handleDocumentChange,
    handleSave,
    handleSubmit
  } = useDossierForm();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-certif-blue">Formulaire de réception des dossiers</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <EntrepriseInfoForm
            entreprise={entreprise}
            promoteur={promoteur}
            telephone={telephone}
            produits={produits}
            onEntrepriseChange={setEntreprise}
            onPromoteurChange={setPromoteur}
            onTelephoneChange={setTelephone}
            onProduitsChange={setProduits}
          />
          
          <DocumentsSection
            documents={documents}
            onDocumentChange={handleDocumentChange}
          />
        </CardContent>
        
        <CardFooter>
          <FormFooter onSave={handleSave} />
        </CardFooter>
      </form>
    </Card>
  );
};

export default AccueilForm;
