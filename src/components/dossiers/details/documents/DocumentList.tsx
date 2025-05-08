
import React from 'react';
import { DocumentDossier } from '@/types';
import { File, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentListProps {
  documents: DocumentDossier[];
  onViewDocument: (doc: DocumentDossier) => void;
}

// Helper function to format document type
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

const DocumentList: React.FC<DocumentListProps> = ({ documents, onViewDocument }) => {
  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div 
          key={doc.id} 
          className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-md">
              <File className="h-5 w-5 text-gray-500" />
            </div>
            <div>
              <p className="font-medium">{doc.nom}</p>
              <p className="text-sm text-gray-500">{formatDocumentType(doc.type)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => onViewDocument(doc)}>
              <Eye className="h-4 w-4 mr-1" />
              Voir
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Expose the helper function for other components
DocumentList.formatDocumentType = formatDocumentType;

export default DocumentList;
