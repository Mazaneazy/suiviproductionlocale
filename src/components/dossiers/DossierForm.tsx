
import React from 'react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Dossier } from '@/types';
import { DossierBasicFields } from './fields/DossierBasicFields';
import { DossierDateFields } from './fields/DossierDateFields';
import { DossierStatusField } from './fields/DossierStatusField';
import { Upload, X, CheckCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { DocumentUpload } from './hooks/useDossierForm';

interface DossierFormProps {
  dossier: Omit<Dossier, 'id'>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onStatusChange: (value: "complet" | "en_attente" | "rejete" | "en_cours" | "certifie" | "a_corriger") => void;
  onSubmit: () => void;
  documents?: DocumentUpload[];
  fileInputRefs?: {
    registre_commerce: React.RefObject<HTMLInputElement>;
    carte_contribuable: React.RefObject<HTMLInputElement>;
    processus_production: React.RefObject<HTMLInputElement>;
    certificats_conformite: React.RefObject<HTMLInputElement>;
    liste_personnel: React.RefObject<HTMLInputElement>;
    plan_localisation: React.RefObject<HTMLInputElement>;
  };
  handleFileChange?: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void;
  removeFile?: (type: string) => void;
}

const DossierForm = ({ 
  dossier, 
  onInputChange, 
  onStatusChange,
  onSubmit,
  documents,
  fileInputRefs,
  handleFileChange,
  removeFile
}: DossierFormProps) => {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Form>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <DossierBasicFields dossier={dossier} onInputChange={onInputChange} />
        <DossierDateFields dossier={dossier} onInputChange={onInputChange} />
        <DossierStatusField dossier={dossier} onStatusChange={onStatusChange} />
        
        {documents && fileInputRefs && handleFileChange && removeFile && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Documents requis (format PDF)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <div key={doc.type} className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor={doc.type}>
                      {doc.label} {doc.required && <span className="text-red-500">*</span>}
                    </Label>
                    
                    {doc.file ? (
                      <div className="flex items-center">
                        <CheckCircle size={18} className="text-certif-green mr-2" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(doc.type)}
                          className="text-certif-red h-8 px-2"
                        >
                          <X size={18} />
                        </Button>
                      </div>
                    ) : null}
                  </div>
                  
                  {!doc.file ? (
                    <div>
                      <input 
                        type="file" 
                        id={doc.type} 
                        accept="application/pdf"
                        ref={fileInputRefs[doc.type as keyof typeof fileInputRefs]}
                        onChange={(e) => handleFileChange(e, doc.type)}
                        className="hidden" 
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => fileInputRefs[doc.type as keyof typeof fileInputRefs].current?.click()}
                      >
                        <Upload size={18} className="mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  ) : (
                    <div className="text-sm truncate text-gray-600">{doc.file.name}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" className="bg-certif-green hover:bg-certif-green/90">
            Enregistrer
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DossierForm;
