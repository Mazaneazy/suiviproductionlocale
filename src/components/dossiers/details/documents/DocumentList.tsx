
import React from 'react';
import { DocumentDossier } from '@/types';
import { File, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDocumentType } from '@/utils/documentTypeUtils';

interface DocumentListProps {
  documents: DocumentDossier[];
  onViewDocument: (doc: DocumentDossier) => void;
}

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

export default DocumentList;
