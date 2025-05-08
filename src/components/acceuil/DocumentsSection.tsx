
import React from 'react';
import DocumentUploadItem, { DocumentUploadProps } from './DocumentUploadItem';

export interface DocumentUpload {
  type: 'registre_commerce' | 'carte_contribuable' | 'processus_production' | 'certificats_conformite' | 'liste_personnel' | 'plan_localisation';
  file: File | null;
  label: string;
  required: boolean;
}

interface DocumentsSectionProps {
  documents: DocumentUpload[];
  onDocumentChange: (type: string, file: File | null) => void;
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ documents, onDocumentChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Documents requis (format PDF)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <DocumentUploadItem
            key={doc.type}
            type={doc.type}
            file={doc.file}
            label={doc.label}
            required={doc.required}
            onFileChange={onDocumentChange}
          />
        ))}
      </div>
    </div>
  );
};

export default DocumentsSection;
