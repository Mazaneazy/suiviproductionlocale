
import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DialogTitle } from '@/components/ui/dialog';
import { DocumentDossier } from '@/types';
import { formatDocumentType } from '@/utils/documentTypeUtils';

interface DocumentViewerToolbarProps {
  document: DocumentDossier;
  zoom: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
}

const DocumentViewerToolbar: React.FC<DocumentViewerToolbarProps> = ({
  document,
  zoom,
  handleZoomIn,
  handleZoomOut
}) => {
  const { toast } = useToast();
  
  const handleDownload = () => {
    toast({
      title: "Téléchargement initialisé",
      description: `Le document ${document.nom} va être téléchargé`,
    });
  };
  
  return (
    <div className="flex items-center justify-between mb-4">
      <DialogTitle className="text-lg">
        {document.type !== 'pdf' ? formatDocumentType(document.type) : document.nom}
      </DialogTitle>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-sm">{Math.round(zoom * 100)}%</span>
        <Button variant="outline" size="sm" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DocumentViewerToolbar;
