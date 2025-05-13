
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, FileCheck, File } from 'lucide-react';

interface PDFUploaderProps {
  onFileSelected: (file: File) => void;
  onFileRemoved?: () => void;
  acceptedTypes?: string; // Exemple: 'application/pdf,.pdf'
  maxSizeMB?: number;
  currentFile?: File | null;
  label?: string;
  helpText?: string;
  required?: boolean;
  className?: string;
}

const PDFUploader: React.FC<PDFUploaderProps> = ({
  onFileSelected,
  onFileRemoved,
  acceptedTypes = 'application/pdf,.pdf',
  maxSizeMB = 10,
  currentFile = null,
  label = 'Télécharger un fichier',
  helpText = 'Format PDF uniquement',
  required = false,
  className = '',
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(currentFile);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) return;
    
    // Vérification de la taille du fichier
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: 'Fichier trop volumineux',
        description: `La taille maximale est de ${maxSizeMB} MB`,
        variant: 'destructive',
      });
      return;
    }
    
    // Vérification du type de fichier
    const fileType = selectedFile.type.toLowerCase();
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    
    if (
      !acceptedTypes.includes(fileType) && 
      !acceptedTypes.includes(`.${fileExtension}`)
    ) {
      toast({
        title: 'Format non supporté',
        description: `Le fichier doit être au format ${acceptedTypes.replace(/,/g, ', ')}`,
        variant: 'destructive',
      });
      return;
    }
    
    // Simulation de téléchargement
    setIsUploading(true);
    setFile(selectedFile);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setTimeout(() => {
          setIsUploading(false);
          onFileSelected(selectedFile);
          
          toast({
            title: 'Fichier téléchargé',
            description: `Le fichier ${selectedFile.name} a été téléchargé avec succès`,
          });
        }, 500);
      }
      
      setUploadProgress(progress);
    }, 200);
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    onFileRemoved?.();
    
    toast({
      title: 'Fichier supprimé',
      description: 'Le fichier a été supprimé',
    });
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {!file ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            {label && (
              <p className="text-sm font-medium">
                {label} {required && <span className="text-red-500">*</span>}
              </p>
            )}
          </div>
          
          <div className="border-2 border-dashed rounded-md p-4 text-center hover:bg-gray-50 transition-colors">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept={acceptedTypes}
              onChange={handleFileChange}
            />
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Sélectionner un fichier
            </Button>
            
            {helpText && (
              <p className="text-xs text-gray-500 mt-2">{helpText}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="border rounded-md p-3 bg-gray-50">
          {isUploading ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Téléchargement en cours...</p>
                <span className="text-xs text-gray-500">{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-1" />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-green-50 p-1 rounded-full">
                  <FileCheck className="h-5 w-5 text-green-500" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              
              <Button
                size="sm"
                variant="ghost"
                className="text-gray-500 hover:text-red-500"
                onClick={removeFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function formatFileSize(size: number): string {
  if (size < 1024) return `${size} octets`;
  if (size < 1048576) return `${(size / 1024).toFixed(1)} Ko`;
  return `${(size / 1048576).toFixed(1)} Mo`;
}

export default PDFUploader;
