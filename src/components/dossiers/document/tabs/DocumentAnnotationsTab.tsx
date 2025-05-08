
import React from 'react';
import { Button } from '@/components/ui/button';

interface DocumentAnnotationsTabProps {
  setActiveTab: (tab: string) => void;
  darkMode?: boolean;
}

const DocumentAnnotationsTab: React.FC<DocumentAnnotationsTabProps> = ({ setActiveTab, darkMode = false }) => {
  return (
    <div className={`rounded-md p-4 transition-colors duration-300 ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white'}`}>
      <div className="flex flex-col h-full">
        <p className={`text-sm mb-4 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
