
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import DocumentViewer from '../../document/DocumentViewer';
import { DocumentDossier } from '@/types';

interface DocumentViewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: DocumentDossier | null;
}

const DocumentViewerDialog: React.FC<DocumentViewerDialogProps> = ({ 
  open, 
  onOpenChange, 
  document 
}) => {
  const formatDocumentType = (type: string): string => {
    switch (type) {
      case 'registre_commerce':
        return 'Registre de Commerce';
      case 'carte_contribuable':
        return 'Carte de Contribuable';
      case 'processus_production':
        return 'Processus de production';
      case 'certificats_conformite':
        return 'Certificats';
      case 'liste_personnel':
        return 'Liste du personnel';
      case 'plan_localisation':
        return 'Plan de localisation';
      case 'pdf':
      default:
        return 'Autres documents';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-4">
        <div className="flex-1 overflow-hidden">
          {document && <DocumentViewer document={document} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewerDialog;
