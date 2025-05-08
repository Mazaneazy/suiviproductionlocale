
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
    reference,
    handleDocumentChange,
    handleSave,
    handleSubmit,
    isSubmitting
  } = useDossierForm();

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-2xl text-certif-blue">Formulaire de réception des dossiers</CardTitle>
        <Alert variant="info" className="bg-blue-50 text-blue-800 border-blue-200 mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Information importante</AlertTitle>
          <AlertDescription>
            Veuillez remplir tous les champs obligatoires et téléverser les documents requis pour que la demande puisse être traitée.
            Une fois le dossier enregistré, il sera transmis au Responsable Technique pour validation.
          </AlertDescription>
        </Alert>
        {reference && (
          <div className="flex justify-between items-center mt-4 bg-green-50 p-3 rounded-md border border-green-200">
            <div>
              <h4 className="text-sm font-semibold text-green-800">Référence du dossier</h4>
              <p className="text-green-700 text-lg">{reference}</p>
            </div>
            <div className="text-xs text-green-600">
              Conservez cette référence pour le suivi
            </div>
          </div>
        )}
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-6">
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
        
        <CardFooter className="bg-gray-50 border-t pt-4">
          <FormFooter onSave={handleSave} isSubmitting={isSubmitting} />
        </CardFooter>
      </form>
    </Card>
  );
};

export default AccueilForm;
