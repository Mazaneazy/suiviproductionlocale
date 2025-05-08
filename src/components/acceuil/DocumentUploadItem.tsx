
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface DocumentUploadProps {
  type: 'registre_commerce' | 'carte_contribuable' | 'processus_production' | 'certificats_conformite' | 'liste_personnel' | 'plan_localisation';
  file: File | null;
  label: string;
  required: boolean;
  onFileChange: (type: string, file: File | null) => void;
}

const DocumentUploadItem: React.FC<DocumentUploadProps> = ({ type, file, label, required, onFileChange }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    
    if (selectedFile && !selectedFile.type.includes('pdf')) {
      toast({
        variant: "destructive",
        title: "Format invalide",
        description: "Veuillez télécharger un fichier PDF uniquement.",
      });
      return;
    }
    
    onFileChange(type, selectedFile);
  };

  const removeFile = () => {
    onFileChange(type, null);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="border rounded-md p-4">
      <div className="flex items-center justify-between mb-2">
        <Label htmlFor={type}>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        
        {file ? (
          <div className="flex items-center">
            <CheckCircle size={18} className="text-certif-green mr-2" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="text-certif-red h-8 px-2"
            >
              <X size={18} />
            </Button>
          </div>
        ) : null}
      </div>
      
      {!file ? (
        <div>
          <input 
            type="file" 
            id={type} 
            accept="application/pdf"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden" 
          />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={18} className="mr-2" />
            Télécharger
          </Button>
        </div>
      ) : (
        <div className="text-sm truncate text-gray-600">{file.name}</div>
      )}
    </div>
  );
};

export default DocumentUploadItem;
