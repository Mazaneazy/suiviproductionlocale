
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import EntrepriseInfoForm from './EntrepriseInfoForm';
import DocumentsSection from './DocumentsSection';
import FormFooter from './FormFooter';
import { useDossierForm } from './useDossierForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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
    email,
    setEmail,
    adresse,
    setAdresse,
    handleDocumentChange,
    handleSave,
    handleSubmit,
    isSubmitting
  } = useDossierForm();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-certif-blue">Formulaire de réception des dossiers</CardTitle>
        <Alert variant="info" className="bg-blue-50 text-blue-800 border-blue-200 mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Information importante</AlertTitle>
          <AlertDescription>
            Veuillez remplir tous les champs obligatoires et téléverser les documents requis pour que la demande puisse être traitée.
          </AlertDescription>
        </Alert>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <EntrepriseInfoForm
            entreprise={entreprise}
            promoteur={promoteur}
            telephone={telephone}
            produits={produits}
            email={email}
            adresse={adresse}
            onEntrepriseChange={setEntreprise}
            onPromoteurChange={setPromoteur}
            onTelephoneChange={setTelephone}
            onProduitsChange={setProduits}
            onEmailChange={setEmail}
            onAdresseChange={setAdresse}
          />
          
          <DocumentsSection
            documents={documents}
            onDocumentChange={handleDocumentChange}
          />
        </CardContent>
        
        <CardFooter>
          <FormFooter onSave={handleSave} isSubmitting={isSubmitting} />
        </CardFooter>
      </form>
    </Card>
  );
};

export default AccueilForm;
