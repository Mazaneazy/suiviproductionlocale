
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
