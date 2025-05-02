
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dossier } from '@/types';
import DossierBasicFields from './fields/DossierBasicFields';
import DossierDateFields from './fields/DossierDateFields';
import DossierStatusField from './fields/DossierStatusField';
import DocumentFields from './fields/DocumentFields';
import { useDossierForm } from './hooks/useDossierForm';
import { Separator } from '@/components/ui/separator';
import { Check } from 'lucide-react';

interface DossierFormProps {
  newDossier: Omit<Dossier, 'id'>;
  setNewDossier: React.Dispatch<React.SetStateAction<Omit<Dossier, 'id'>>>;
  onSubmit: () => void;
  onCancel: () => void;
}

const DossierForm = ({ newDossier, setNewDossier, onSubmit, onCancel }: DossierFormProps) => {
  const { 
    handleInputChange, 
    handleStatusChange, 
    handleAddDossier,
    documents,
    fileInputRefs,
    handleFileChange,
    removeFile
  } = useDossierForm(
    newDossier, 
    setNewDossier, 
    onSubmit
  );

  // Check if required fields are filled
  const isFormValid = newDossier.operateurNom && newDossier.typeProduit;

  return (
    <div className="grid gap-4 py-4">
      <DossierBasicFields 
        newDossier={newDossier} 
        handleInputChange={handleInputChange} 
      />
      
      <Separator className="my-2" />
      
      <DossierDateFields 
        newDossier={newDossier} 
        handleInputChange={handleInputChange} 
      />
      
      <Separator className="my-2" />
      
      <DossierStatusField 
        status={newDossier.status} 
        onStatusChange={handleStatusChange} 
      />
      
      <Separator className="my-2" />
      
      <DocumentFields
        documents={documents}
        fileInputRefs={fileInputRefs}
        handleFileChange={handleFileChange}
        removeFile={removeFile}
      />
      
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button 
          onClick={handleAddDossier} 
          className="bg-certif-green hover:bg-certif-green/90"
          disabled={!isFormValid}
        >
          <Check className="mr-1 h-4 w-4" />
          Enregistrer
        </Button>
      </div>
    </div>
  );
};

export default DossierForm;
