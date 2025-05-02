
import React from 'react';
import { Dossier } from '@/types';
import DossierBasicFields from './fields/DossierBasicFields';
import DossierDateFields from './fields/DossierDateFields';
import DocumentFields from './fields/DocumentFields';
import { useDossierForm } from './hooks/useDossierForm';
import { Separator } from '@/components/ui/separator';

interface DossierFormProps {
  newDossier: Omit<Dossier, 'id'>;
  setNewDossier: React.Dispatch<React.SetStateAction<Omit<Dossier, 'id'>>>;
  onSubmit: () => void;
  onCancel: () => void;
}

const DossierForm = ({ newDossier, setNewDossier, onSubmit, onCancel }: DossierFormProps) => {
  const { 
    handleInputChange, 
    handleFileChange,
    handleAddDossier,
    documents,
    fileInputRefs,
    removeFile
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
      
      <Separator className="my-2" />
      
      <DossierDateFields 
        newDossier={newDossier} 
        handleInputChange={handleInputChange} 
      />
      
      <Separator className="my-2" />
      
      <DocumentFields
        documents={documents}
        fileInputRefs={fileInputRefs}
        handleFileChange={handleFileChange}
        removeFile={removeFile}
      />
    </div>
  );
};

export default DossierForm;
