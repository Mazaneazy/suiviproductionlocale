
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Upload, FileCheck } from 'lucide-react';
import PDFUploader from '@/components/shared/PDFUploader';
import { formatDocumentType } from '@/utils/documentTypeUtils';

export interface DocumentUploadItem {
  type: string;
  file: File | null;
  label: string;
  required: boolean;
  description?: string;
}

interface DocumentsUploadFormProps {
  documents: DocumentUploadItem[];
  onDocumentChange: (type: string, file: File | null) => void;
  onSubmit?: () => void;
  submitButtonText?: string;
  allowMultipleFiles?: boolean;
}

const DocumentsUploadForm: React.FC<DocumentsUploadFormProps> = ({
  documents,
  onDocumentChange,
  onSubmit,
  submitButtonText = 'Soumettre les documents',
  allowMultipleFiles = false
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requiredDocuments = documents.filter(doc => doc.required);
  const optionalDocuments = documents.filter(doc => !doc.required);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier que tous les documents requis sont présents
    const missingRequired = requiredDocuments.filter(doc => !doc.file);
    if (missingRequired.length > 0) {
      toast({
        title: "Documents manquants",
        description: `Veuillez télécharger tous les documents obligatoires (${missingRequired.map(d => d.label).join(', ')})`,
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simuler un délai de soumission
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit?.();
      
      toast({
        title: "Documents soumis avec succès",
        description: `${documents.filter(d => d.file).length} document(s) soumis`
      });
    }, 1000);
  };
  
  // Compter les documents téléchargés
  const uploadedCount = documents.filter(d => d.file).length;
  const requiredCount = requiredDocuments.length;
  const uploadedRequiredCount = requiredDocuments.filter(d => d.file).length;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* En-tête et statistiques */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-medium text-certif-blue">Documents à fournir</h3>
          <p className="text-sm text-gray-600">
            Veuillez télécharger tous les documents nécessaires au format PDF
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full flex items-center">
            <FileCheck className="h-4 w-4 mr-1" />
            <span>{uploadedCount} / {documents.length} documents</span>
          </div>
          
          <div 
            className={`px-3 py-1 rounded-full flex items-center
              ${uploadedRequiredCount === requiredCount ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}
          >
            <span>Requis: {uploadedRequiredCount} / {requiredCount}</span>
          </div>
        </div>
      </div>
      
      {/* Alerte pour les informations importantes */}
      <Alert variant="warning">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          Les documents doivent être au format PDF uniquement et ne pas dépasser 10 Mo.
          Assurez-vous que tous les documents sont lisibles et complets.
        </AlertDescription>
      </Alert>
      
      {/* Documents requis */}
      {requiredDocuments.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            Documents obligatoires
            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Requis</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requiredDocuments.map((doc) => (
              <div key={doc.type} className="border rounded-md p-4">
                <PDFUploader
                  onFileSelected={(file) => onDocumentChange(doc.type, file)}
                  onFileRemoved={() => onDocumentChange(doc.type, null)}
                  currentFile={doc.file}
                  label={doc.label}
                  helpText={doc.description || formatDocumentType(doc.type)}
                  required={doc.required}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Documents optionnels */}
      {optionalDocuments.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            Documents supplémentaires
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Optionnels</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {optionalDocuments.map((doc) => (
              <div key={doc.type} className="border rounded-md p-4">
                <PDFUploader
                  onFileSelected={(file) => onDocumentChange(doc.type, file)}
                  onFileRemoved={() => onDocumentChange(doc.type, null)}
                  currentFile={doc.file}
                  label={doc.label}
                  helpText={doc.description || formatDocumentType(doc.type)}
                  required={false}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Ajouter un document supplémentaire */}
      {allowMultipleFiles && (
        <div className="mt-6 border-t pt-4">
          <Button 
            type="button" 
            variant="outline" 
            className="flex items-center"
            onClick={() => {
              // Logique pour ajouter un champ de document supplémentaire
              console.log("Fonctionnalité à implémenter: ajout de document supplémentaire");
              toast({
                title: "Fonctionnalité en développement",
                description: "L'ajout de documents supplémentaires sera disponible dans une prochaine version"
              });
            }}
          >
            <Upload className="mr-2 h-4 w-4" />
            Ajouter un document supplémentaire
          </Button>
        </div>
      )}
      
      {/* Bouton de soumission */}
      {onSubmit && (
        <div className="mt-6 flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting || uploadedRequiredCount < requiredCount}
            className="px-6"
          >
            {isSubmitting ? 'Traitement en cours...' : submitButtonText}
          </Button>
        </div>
      )}
    </form>
  );
};

export default DocumentsUploadForm;
