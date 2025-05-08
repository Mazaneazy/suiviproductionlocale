
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Bookmark, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocumentAnnotationsTabProps {
  setActiveTab: (tab: string) => void;
  darkMode?: boolean;
}

const DocumentAnnotationsTab: React.FC<DocumentAnnotationsTabProps> = ({ setActiveTab, darkMode = false }) => {
  const { toast } = useToast();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  
  const handleSelectTool = (tool: string) => {
    setSelectedTool(tool);
    toast({
      title: "Outil sélectionné",
      description: `L'outil ${tool} est maintenant actif. Cliquez sur le document pour l'appliquer.`,
    });
  };
  
  const handlePreviewClick = () => {
    setActiveTab('preview');
    if (selectedTool) {
      // Simule l'ajout d'une annotation
      toast({
        title: "Annotation ajoutée",
        description: "L'annotation a été ajoutée au document.",
      });
    }
  };
  
  return (
    <div className={`rounded-md p-4 transition-colors duration-300 ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white'}`}>
      <div className="flex flex-col h-full">
        <p className={`text-sm mb-4 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Utilisez les outils d'annotation pour marquer des éléments importants sur le document.
          Pour ajouter une annotation, cliquez sur l'aperçu du document.
        </p>
        
        <div className="flex gap-2 mb-4">
          <Button 
            variant={selectedTool === 'pencil' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleSelectTool('pencil')}
            className={darkMode && selectedTool !== 'pencil' ? 'border-gray-600 hover:bg-gray-700' : ''}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Dessiner
          </Button>
          
          <Button 
            variant={selectedTool === 'highlight' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleSelectTool('highlight')}
            className={darkMode && selectedTool !== 'highlight' ? 'border-gray-600 hover:bg-gray-700' : ''}
          >
            <Bookmark className="h-4 w-4 mr-2" />
            Surligner
          </Button>
          
          {selectedTool && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedTool(null)}
              className={darkMode ? 'border-gray-600 hover:bg-gray-700' : ''}
            >
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
          )}
        </div>
        
        <div className="flex-1">
          <Button 
            variant="default" 
            size="sm" 
            onClick={handlePreviewClick}
            className="mb-4"
          >
            {selectedTool ? "Appliquer l'annotation et retourner" : "Retour à l'aperçu"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentAnnotationsTab;
