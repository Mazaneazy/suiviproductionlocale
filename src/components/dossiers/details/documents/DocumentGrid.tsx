
import React from 'react';
import { DocumentDossier } from '@/types';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { formatDocumentType } from '@/utils/documentTypeUtils';

interface DocumentGridProps {
  groupedDocuments: Record<string, DocumentDossier[]>;
  onViewDocument: (doc: DocumentDossier) => void;
}

const DocumentGrid: React.FC<DocumentGridProps> = ({ groupedDocuments, onViewDocument }) => {
  return (
    <div className="space-y-6">
      {Object.entries(groupedDocuments).map(([type, docs]) => (
        <div key={type} className="space-y-2">
          <h4 className="font-medium text-gray-700">{formatDocumentType(type)}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {docs.map(doc => (
              <div 
                key={doc.id}
                className="border p-3 rounded-md hover:bg-gray-50 flex flex-col"
              >
                <div className="flex-1">
                  <p className="font-medium line-clamp-2">{doc.nom}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(doc.dateUpload).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-center"
                    onClick={() => onViewDocument(doc)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Voir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentGrid;
