
import React from 'react';
import { DocumentDossier } from '@/types';
import DocumentCard from './DocumentCard';

interface DocumentsListProps {
  documents: DocumentDossier[];
  onValidate: (docId: string, status: 'valide' | 'rejete') => void;
  documentStatuses: Record<string, string>;
}

const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
  onValidate,
  documentStatuses
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Documents du dossier</h3>
      {documents.length > 0 ? (
        <div className="space-y-3">
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onValidate={onValidate}
              documentStatuses={documentStatuses}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Aucun document disponible</p>
      )}
    </div>
  );
};

export default DocumentsList;
