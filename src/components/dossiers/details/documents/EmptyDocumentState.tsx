
import React from 'react';
import { Button } from '@/components/ui/button';
import { File, AlertCircle, RefreshCw } from 'lucide-react';
import PDFUploader from '@/components/shared/PDFUploader';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';

interface EmptyDocumentStateProps {
  isLoading: boolean;
  canViewDocuments: boolean;
  dossierId?: string;
  onRefresh?: () => void;
  onUpload?: (file: File) => void;
}

const EmptyDocumentState: React.FC<EmptyDocumentStateProps> = ({
  isLoading,
  canViewDocuments,
  dossierId,
  onRefresh,
  onUpload
}) => {
  const { toast } = useToast();

  const handleFileUpload = (file: File) => {
    if (!dossierId) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le document car aucun dossier n'est sélectionné",
        variant: "destructive",
      });
      return;
    }
    
    onUpload?.(file);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-8">
        <Spinner variant="default" />
        <p className="text-gray-500 mt-4">Chargement des documents...</p>
      </div>
    );
  }

  if (!canViewDocuments) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-8 text-center">
        <div className="rounded-full bg-yellow-100 p-3 mb-4">
          <AlertCircle size={32} className="text-yellow-600" />
        </div>
        <h3 className="text-lg font-medium mb-2">Accès restreint</h3>
        <p className="text-gray-500 mb-4">
          Vous n'avez pas les autorisations nécessaires pour consulter les documents de ce dossier.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-64 p-8 text-center">
      <div className="rounded-full bg-gray-100 p-3 mb-4">
        <File size={32} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-medium mb-2">Aucun document</h3>
      <p className="text-gray-500 mb-4">
        Ce dossier ne contient aucun document pour le moment.
      </p>
      
      <div className="flex items-center gap-2">
        {onRefresh && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onRefresh}
            className="flex items-center"
          >
            <RefreshCw size={16} className="mr-2" />
            Actualiser
          </Button>
        )}
        
        {onUpload && (
          <div className="max-w-xs">
            <PDFUploader
              onFileSelected={handleFileUpload}
              label="Ajouter un document"
              helpText="Format PDF, taille max 10 Mo"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyDocumentState;
