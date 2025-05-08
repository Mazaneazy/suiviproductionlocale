
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { File, FileText, Download, Eye } from 'lucide-react';
import { DocumentDossier } from '@/types';

interface DocumentListProps {
  documents: DocumentDossier[];
  onViewDocument: (doc: DocumentDossier) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  onViewDocument
}) => {
  return (
    <ScrollArea className="h-[320px] pr-4">
      {documents.map((doc) => (
        <div 
          key={doc.id} 
          className={`border rounded-md p-3 mb-3 flex items-center justify-between
            ${doc.status === 'valide' ? 'bg-green-50 border-green-200' : 
              doc.status === 'rejete' ? 'bg-red-50 border-red-200' : 
              'bg-white'}`}
        >
          <div className="flex items-center space-x-3">
            {doc.type === 'pdf' ? (
              <File className="text-red-500 flex-shrink-0" size={24} />
            ) : (
              <FileText className="text-certif-blue flex-shrink-0" size={24} />
            )}
            <div>
              <p className="font-medium">
                {doc.type !== 'pdf' ? formatDocumentType(doc.type) : doc.nom}
              </p>
              <p className="text-sm text-gray-500">
                Téléversé le {new Date(doc.dateUpload).toLocaleDateString()}
              </p>
              {doc.status && (
                <span className={`text-xs px-2 py-1 rounded-full inline-block mt-1
                  ${doc.status === 'valide' ? 'bg-green-100 text-green-700' : 
                    doc.status === 'rejete' ? 'bg-red-100 text-red-700' : 
                    'bg-yellow-100 text-yellow-700'}`}>
                  {doc.status === 'valide' ? 'Validé' : 
                    doc.status === 'rejete' ? 'Rejeté' : 'En attente'}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewDocument(doc)}
              className="flex-shrink-0"
            >
              <Eye size={16} className="mr-1" />
              Voir
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="flex-shrink-0"
            >
              <Download size={16} className="mr-1" />
              Télécharger
            </Button>
          </div>
        </div>
      ))}
    </ScrollArea>
  );
};

// Helper function for document type formatting
export const formatDocumentType = (type: string): string => {
  switch (type) {
    case 'registre_commerce':
      return 'Registre de Commerce';
    case 'carte_contribuable':
      return 'Carte de Contribuable (NIU)';
    case 'processus_production':
      return 'Schéma du processus de production';
    case 'certificats_conformite':
      return 'Certificats de Conformité';
    case 'liste_personnel':
      return 'Liste du personnel';
    case 'plan_localisation':
      return 'Plan de localisation';
    default:
      return type;
  }
};

export default DocumentList;
