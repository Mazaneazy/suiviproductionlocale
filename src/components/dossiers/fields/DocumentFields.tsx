
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DocumentUpload } from '../hooks/useDossierForm';
import { Paperclip, Upload, X } from 'lucide-react';

interface DocumentFieldsProps {
  documents: DocumentUpload[];
  fileInputRefs: {
    registre_commerce: React.RefObject<HTMLInputElement>;
    carte_contribuable: React.RefObject<HTMLInputElement>;
    processus_production: React.RefObject<HTMLInputElement>;
    certificats_conformite: React.RefObject<HTMLInputElement>;
    liste_personnel: React.RefObject<HTMLInputElement>;
    plan_localisation: React.RefObject<HTMLInputElement>;
  };
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void;
  removeFile: (type: string) => void;
}

const DocumentFields: React.FC<DocumentFieldsProps> = ({
  documents,
  fileInputRefs,
  handleFileChange,
  removeFile
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Paperclip className="mr-2 h-4 w-4" />
        <h3 className="text-sm font-medium">Documents requis</h3>
      </div>
      <Separator />
      
      <div className="grid grid-cols-1 gap-4">
        {documents.map((doc) => (
          <div key={doc.type} className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor={doc.type} className="text-sm font-medium">
                {doc.label} {doc.required && <span className="text-red-500">*</span>}
              </label>
              {doc.file ? (
                <div className="flex items-center text-sm">
                  <span className="mr-2 truncate max-w-[200px]">{doc.file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => removeFile(doc.type)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => fileInputRefs[doc.type as keyof typeof fileInputRefs].current?.click()}
                >
                  <Upload className="mr-1 h-3 w-3" />
                  Télécharger
                </Button>
              )}
            </div>
            <input
              type="file"
              id={doc.type}
              accept=".pdf"
              className="hidden"
              onChange={(e) => handleFileChange(e, doc.type)}
              ref={fileInputRefs[doc.type as keyof typeof fileInputRefs]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentFields;
