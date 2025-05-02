
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import DossierForm from './DossierForm';
import { Dossier } from '@/types';
import { useDossierForm, DocumentUpload } from './hooks/useDossierForm';

const initialDossier: Omit<Dossier, 'id'> = {
  operateurNom: '',
  promoteurNom: '',
  telephone: '',
  typeProduit: '',
  status: 'en_attente',
  dateTransmission: new Date().toISOString().split('T')[0],
  responsable: 'Responsable Technique',
  delai: 30,
  dateButoir: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
};

const AddDossierDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { addDossier } = useData();
  const [newDossier, setNewDossier] = useState<Omit<Dossier, 'id'>>(initialDossier);
  
  const handleAddDossierWithDocuments = (documents?: DocumentUpload[]) => {
    // Create document objects from files
    const documentObjects = documents
      ? documents
          .filter(doc => doc.file)
          .map(doc => ({
            dossierId: '',  // Will be filled by the createDossier function
            type: doc.type,
            nom: doc.file!.name,
            url: URL.createObjectURL(doc.file!),
            dateUpload: new Date().toISOString(),
            status: 'en_attente' as 'en_attente' | 'valide' | 'rejete'
          }))
      : [];
    
    // Add documents to the dossier - using a structure compatible with Dossier type
    const dossierToAdd = {
      ...newDossier,
      documents: documentObjects
    };
    
    addDossier(dossierToAdd);
    
    // Reset form and close dialog
    setNewDossier(initialDossier);
    setOpen(false);
  };
  
  const { 
    handleInputChange, 
    handleStatusChange, 
    handleAddDossier,
    documents,
    fileInputRefs,
    handleFileChange,
    removeFile
  } = useDossierForm(newDossier, setNewDossier, handleAddDossierWithDocuments);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-certif-green hover:bg-certif-green/90">
          <PlusCircle className="mr-2" size={16} />
          Nouveau dossier
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-certif-blue">Ajouter un nouveau dossier</DialogTitle>
        </DialogHeader>
        <DossierForm 
          dossier={newDossier} 
          onInputChange={handleInputChange}
          onStatusChange={handleStatusChange}
          onSubmit={handleAddDossier}
          documents={documents}
          fileInputRefs={fileInputRefs}
          handleFileChange={handleFileChange}
          removeFile={removeFile}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddDossierDialog;
