
import React from 'react';
import DocumentUploadItem from './DocumentUploadItem';
import { AlertCircle, FileText } from 'lucide-react';

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
  const requiredDocuments = documents.filter(doc => doc.required);
  const optionalDocuments = documents.filter(doc => !doc.required);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="h-5 w-5 text-certif-blue" />
        <h3 className="text-lg font-medium text-certif-blue">Documents à fournir</h3>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <h3 className="text-md font-medium text-certif-blue">Documents requis (format PDF)</h3>
            <p className="text-sm text-gray-500 mt-1">Veuillez télécharger tous les documents nécessaires au traitement de votre dossier</p>
          </div>
          <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-sm">
            <AlertCircle size={16} className="mr-2" />
            <span>Format PDF uniquement</span>
          </div>
        </div>
        
        {requiredDocuments.length > 0 && (
          <div className="mt-4">
            <h4 className="text-md font-medium mb-3 text-gray-700 flex items-center">
              Documents obligatoires 
              <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Requis</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requiredDocuments.map((doc) => (
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
        )}
        
        {optionalDocuments.length > 0 && (
          <div className="pt-4 mt-4 border-t border-gray-100">
            <h4 className="text-md font-medium mb-3 text-gray-700 flex items-center">
              Documents complémentaires
              <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Optionnels</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {optionalDocuments.map((doc) => (
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
        )}
      </div>
    </div>
  );
};

export default DocumentsSection;
