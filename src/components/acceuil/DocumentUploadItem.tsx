
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, CheckCircle, FileText } from 'lucide-react';
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
    
    if (selectedFile) {
      // Vérifier la taille du fichier (limitée à 10 Mo)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Fichier trop volumineux",
          description: "La taille du fichier ne doit pas dépasser 10 Mo.",
        });
        return;
      }
      
      // Vérifier le format du fichier
      if (!selectedFile.type.includes('pdf')) {
        toast({
          variant: "destructive",
          title: "Format invalide",
          description: "Veuillez télécharger un fichier PDF uniquement.",
        });
        return;
      }
    }
    
    onFileChange(type, selectedFile);
    
    if (selectedFile) {
      toast({
        title: "Document ajouté",
        description: `Le document "${selectedFile.name}" a été ajouté avec succès.`,
      });
    }
  };

  const removeFile = () => {
    onFileChange(type, null);
    
    // Réinitialiser l'input de fichier
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    toast({
      variant: "default",
      title: "Document supprimé",
      description: "Le document a été supprimé avec succès.",
    });
  };

  return (
    <div className={`border rounded-md p-4 transition-all duration-300 ${file ? 'bg-green-50 border-green-200' : 'hover:border-blue-300 bg-white'}`}>
      <div className="flex items-center justify-between mb-2">
        <Label htmlFor={type} className="flex items-center">
          {file ? <CheckCircle size={16} className="text-green-500 mr-2" /> : <FileText size={16} className="text-gray-500 mr-2" />}
          {label} {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        
        {file ? (
          <div className="flex items-center">
            <span className="text-xs text-green-600 font-medium mr-2">Ajouté</span>
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
            className="w-full transition-colors bg-white hover:bg-blue-50"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={18} className="mr-2" />
            Télécharger{required ? " (Obligatoire)" : ""}
          </Button>
          {required && (
            <p className="text-xs text-red-500 mt-1">Ce document est obligatoire</p>
          )}
        </div>
      ) : (
        <>
          <div className="text-sm truncate text-gray-600 bg-white p-2 rounded border border-gray-200 flex items-center">
            <FileText size={16} className="mr-2 text-blue-500 flex-shrink-0" />
            <span className="truncate">{file.name}</span>
            <span className="text-xs text-gray-500 ml-2">
              ({Math.round(file.size / 1024)} Ko)
            </span>
          </div>
          <p className="text-xs text-green-600 mt-1">Document prêt à être envoyé</p>
        </>
      )}
    </div>
  );
};

export default DocumentUploadItem;
