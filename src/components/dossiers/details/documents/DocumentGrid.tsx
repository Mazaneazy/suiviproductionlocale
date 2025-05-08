
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { FileText, Eye, Download } from 'lucide-react';
import { DocumentDossier } from '@/types';
import { formatDocumentType } from './DocumentList';

interface DocumentGridProps {
  groupedDocuments: Record<string, DocumentDossier[]>;
  onViewDocument: (doc: DocumentDossier) => void;
}

const DocumentGrid: React.FC<DocumentGridProps> = ({
  groupedDocuments,
  onViewDocument
}) => {
  return (
    <ScrollArea className="h-[320px] pr-4">
      {Object.keys(groupedDocuments).length > 0 ? (
        Object.entries(groupedDocuments).map(([type, docs]) => (
          <div key={type} className="mb-6">
            <h4 className="font-medium mb-2 flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              {formatDocumentType(type)} ({docs.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-6">
              {docs.map(doc => (
                <div 
                  key={doc.id}
                  className={`border text-sm p-2 rounded flex justify-between items-center
                    ${doc.status === 'valide' ? 'bg-green-50 border-green-200' : 
                      doc.status === 'rejete' ? 'bg-red-50 border-red-200' : 
                      'bg-white'}`}
                >
                  <div className="truncate flex-1">
                    <span className="font-medium">{doc.nom}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onViewDocument(doc)}
                      className="h-7 w-7 p-0"
                    >
                      <Eye size={14} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-7 w-7 p-0"
                    >
                      <Download size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 py-8">
          Aucun document ne correspond à vos critères de recherche
        </p>
      )}
    </ScrollArea>
  );
};

export default DocumentGrid;
