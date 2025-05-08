
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
  darkMode?: boolean;
}

const DocumentViewerToolbar: React.FC<DocumentViewerToolbarProps> = ({
  document,
  zoom,
  handleZoomIn,
  handleZoomOut,
  darkMode = false
}) => {
  const { toast } = useToast();
  
  const handleDownload = () => {
    toast({
      title: "Téléchargement initialisé",
      description: `Le document ${document.nom} va être téléchargé`,
    });
  };
  
  return (
    <div className={`flex items-center justify-between mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : ''}`}>
      <DialogTitle className={`text-lg transition-colors duration-300 ${darkMode ? 'text-white' : ''}`}>
        {document.type !== 'pdf' ? formatDocumentType(document.type) : document.nom}
      </DialogTitle>
      
      <div className="flex items-center gap-2">
        <Button 
          variant={darkMode ? "outline" : "outline"} 
          size="sm" 
          onClick={handleZoomOut}
          className={darkMode ? 'border-gray-600 hover:bg-gray-700' : ''}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className={`text-sm ${darkMode ? 'text-gray-300' : ''}`}>{Math.round(zoom * 100)}%</span>
        <Button 
          variant={darkMode ? "outline" : "outline"} 
          size="sm" 
          onClick={handleZoomIn}
          className={darkMode ? 'border-gray-600 hover:bg-gray-700' : ''}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button 
          variant={darkMode ? "outline" : "outline"} 
          size="sm" 
          onClick={handleDownload}
          className={darkMode ? 'border-gray-600 hover:bg-gray-700' : ''}
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DocumentViewerToolbar;
