
import React from 'react';
import {
  Dialog,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDossierDetailsDialog } from './details/hooks/useDossierDetailsDialog';
import DossierDialogContent from './details/DossierDialogContent';
import { File } from 'lucide-react';

interface DossierDetailsDialogProps {
  dossierId: string;
  buttonText?: string;
}

const DossierDetailsDialog: React.FC<DossierDetailsDialogProps> = ({ 
  dossierId, 
  buttonText = "Détails" 
}) => {
  const {
    isOpen,
    setIsOpen,
    dossier,
    documents,
    inspections,
    certificat,
    loadingDocuments
  } = useDossierDetailsDialog(dossierId);

  if (!dossierId) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <File className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      
      <DossierDialogContent
        dossier={dossier}
        documents={documents}
        inspections={inspections}
        certificat={certificat}
        loadingDocuments={loadingDocuments}
      />
    </Dialog>
  );
};

export default DossierDetailsDialog;
