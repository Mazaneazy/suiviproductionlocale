
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dossier } from '@/types';
import DossierBasicFields from './fields/DossierBasicFields';
import DossierDateFields from './fields/DossierDateFields';
import { useDossierForm } from './hooks/useDossierForm';
import DocumentFields from './fields/DocumentFields';

interface DossierFormProps {
  newDossier: Omit<Dossier, 'id'>;
  setNewDossier: React.Dispatch<React.SetStateAction<Omit<Dossier, 'id'>>>;
  onSubmit: () => void;
  onCancel: () => void;
}

const DossierForm = ({ newDossier, setNewDossier, onSubmit, onCancel }: DossierFormProps) => {
  const { 
    handleInputChange, 
    handleAddDossier,
    documents,
    handleDocumentAdd,
    handleDocumentRemove
  } = useDossierForm(
    newDossier, 
    setNewDossier, 
    onSubmit
  );

  return (
    <div className="grid gap-4 py-4">
      <DossierBasicFields 
        newDossier={newDossier} 
        handleInputChange={handleInputChange} 
      />
      
      <DossierDateFields 
        newDossier={newDossier} 
        handleInputChange={handleInputChange} 
      />
      
      <DocumentFields 
        documents={documents}
        onDocumentAdd={handleDocumentAdd}
        onDocumentRemove={handleDocumentRemove}
      />
      
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button 
          onClick={handleAddDossier} 
          className="bg-certif-green hover:bg-certif-green/90"
          disabled={!newDossier.operateurNom || !newDossier.typeProduit}
        >
          Enregistrer
        </Button>
      </div>
    </div>
  );
};

export default DossierForm;
