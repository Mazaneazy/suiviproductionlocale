
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Paperclip } from 'lucide-react';

interface EmptyDocumentStateProps {
  isLoading: boolean;
  canViewDocuments: boolean;
  dossierId?: string;
  onRefresh?: () => void;
}

const EmptyDocumentState: React.FC<EmptyDocumentStateProps> = ({
  isLoading,
  canViewDocuments,
  dossierId,
  onRefresh
}) => {
  if (!canViewDocuments) {
    return (
      <div className="flex items-center justify-center h-full p-4 text-center">
        <div>
          <FileText className="mx-auto mb-3 text-gray-400" size={40} />
          <p className="text-lg font-medium text-gray-600">Accès restreint</p>
          <p className="mt-1 text-gray-500">Vous n'avez pas les autorisations nécessaires pour consulter les documents.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-certif-blue mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement des documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full p-4 text-center">
      <div>
        <Paperclip className="mx-auto mb-3 text-gray-400" size={40} />
        <p className="text-lg font-medium text-gray-600">Aucune pièce jointe</p>
        <p className="mt-1 text-gray-500">Ce dossier ne contient pas encore de pièces jointes.</p>
        
        {dossierId && onRefresh && (
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={onRefresh}
          >
            Actualiser les documents
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyDocumentState;
