
import React from 'react';
import { Button } from '@/components/ui/button';

interface DocumentAnnotationsTabProps {
  setActiveTab: (tab: string) => void;
}

const DocumentAnnotationsTab: React.FC<DocumentAnnotationsTabProps> = ({ setActiveTab }) => {
  return (
    <div className="bg-white rounded-md p-4">
      <div className="flex flex-col h-full">
        <p className="text-sm text-gray-500 mb-4">
          Utilisez les outils d'annotation pour marquer des éléments importants sur le document.
          Pour ajouter une annotation, cliquez sur l'aperçu du document.
        </p>
        <div className="flex-1">
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => setActiveTab('preview')}
            className="mb-4"
          >
            Retour à l'aperçu avec les annotations
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentAnnotationsTab;
