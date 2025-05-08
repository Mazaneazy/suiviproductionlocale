
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileImage, X, Upload, Paperclip, FileCheck } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface PdfAttachmentProps {
  attachments: File[];
  onAddAttachment: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAttachment: (index: number) => void;
}

const PdfAttachment: React.FC<PdfAttachmentProps> = ({
  attachments,
  onAddAttachment,
  onRemoveAttachment
}) => {
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, number>>({});

  // Simuler un téléchargement pour montrer le progrès
  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Créer des simulations de progression pour chaque fichier
      const newFiles = Array.from(e.target.files);
      const newUploadingFiles: Record<string, number> = {};
      
      newFiles.forEach(file => {
        newUploadingFiles[file.name] = 0;
      });
      
      setUploadingFiles(newUploadingFiles);
      
      // Simuler l'augmentation de la progression pour chaque fichier
      newFiles.forEach(file => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 20;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Lorsque tous les fichiers sont à 100%, appeler le gestionnaire réel
            if (Object.values(newUploadingFiles).every(p => p >= 100)) {
              setTimeout(() => {
                onAddAttachment(e);
                setUploadingFiles({});
              }, 500);
            }
          }
          
          setUploadingFiles(prev => ({
            ...prev,
            [file.name]: progress
          }));
        }, 200);
      });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center">
        <label htmlFor="pdf-upload" className="cursor-pointer">
          <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-certif-blue to-blue-500 hover:from-certif-blue/90 hover:to-blue-600 text-white rounded-md text-sm font-medium transition-colors">
            <Upload className="h-4 w-4" />
            <span>Téléverser des pièces jointes</span>
          </div>
          <input
            id="pdf-upload"
            type="file"
            accept="application/pdf,.pdf,.doc,.docx,.xls,.xlsx"
            multiple
            className="hidden"
            onChange={handleAttachment}
          />
        </label>
      </div>
      
      {/* Fichiers en cours de téléchargement */}
      {Object.keys(uploadingFiles).length > 0 && (
        <div className="space-y-2 mt-3">
          <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Upload className="h-4 w-4 animate-pulse" />
            Téléchargement en cours...
          </p>
          <ul className="space-y-2 border rounded-md p-2 bg-gray-50">
            {Object.entries(uploadingFiles).map(([fileName, progress]) => (
              <li key={fileName} className="bg-white p-2 rounded-md border">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <FileImage className="h-4 w-4 text-certif-blue" />
                    <span className="text-sm truncate max-w-[200px]">{fileName}</span>
                  </div>
                  <span className="text-xs text-gray-500">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-1" />
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Fichiers attachés */}
      {attachments.length > 0 && (
        <div className="space-y-2 mt-3">
          <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Paperclip className="h-4 w-4" />
            Fichiers attachés ({attachments.length})
          </p>
          <ul className="space-y-2 border rounded-md p-2 bg-gray-50">
            {attachments.map((file, index) => (
              <li key={index} className="flex items-center justify-between bg-white p-2 rounded-md border">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-green-500" />
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({Math.round(file.size / 1024)} Ko)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-500"
                  onClick={() => onRemoveAttachment(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PdfAttachment;
