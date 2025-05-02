
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dossier } from '@/types';
import DossierBasicFields from './fields/DossierBasicFields';
import DossierDateFields from './fields/DossierDateFields';
import DossierStatusField from './fields/DossierStatusField';
import { useDossierForm } from './hooks/useDossierForm';

interface DossierFormProps {
  newDossier: Omit<Dossier, 'id'>;
  setNewDossier: React.Dispatch<React.SetStateAction<Omit<Dossier, 'id'>>>;
  onSubmit: () => void;
  onCancel: () => void;
}

const DossierForm = ({ newDossier, setNewDossier, onSubmit, onCancel }: DossierFormProps) => {
  const { handleInputChange, handleStatusChange, handleAddDossier } = useDossierForm(
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
      
      <DossierStatusField 
        status={newDossier.status} 
        onStatusChange={handleStatusChange} 
      />
      
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={handleAddDossier} className="bg-certif-green hover:bg-certif-green/90">
          Enregistrer
        </Button>
      </div>
    </div>
  );
};

export default DossierForm;
