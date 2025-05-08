
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocumentDossier } from '@/types';
import FileIcon from '../FileIcon';
import { formatDocumentType } from '@/utils/documentTypeUtils';
import DocumentAnnotationLayer from '../DocumentAnnotationLayer';
import { useToast } from '@/hooks/use-toast';

interface DocumentPreviewTabProps {
  document: DocumentDossier;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  zoom: number;
  rotation: number;
  activeTab: string;
  darkMode?: boolean;
}

const DocumentPreviewTab: React.FC<DocumentPreviewTabProps> = ({
  document,
  currentPage,
  setCurrentPage,
  zoom,
  rotation,
  activeTab,
  darkMode = false
}) => {
  const { toast } = useToast();
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement du document
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Pour un PDF réel, nous déterminerions le nombre de pages à partir du document
      // Ici, nous simulons un document avec un nombre aléatoire de pages de 1 à 5
      if (document.type === 'pdf') {
        setTotalPages(Math.floor(Math.random() * 5) + 1);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [document]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      toast({
        title: "Changement de page",
        description: `Page ${newPage} sur ${totalPages}`,
      });
    }
  };

  return (
    <div className={`flex-1 overflow-auto rounded-md p-4 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
      {isLoading ? (
        <div className={`flex items-center justify-center h-full transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          <p>Chargement du document...</p>
        </div>
      ) : (
        <div 
          className={`mx-auto shadow-md flex items-center justify-center relative transition-colors duration-300 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
          style={{ 
            maxWidth: `${Math.min(100, 80 * zoom)}%`, 
            minHeight: '400px',
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 0.3s ease, max-width 0.3s ease'
          }}
        >
          {/* Simulation d'affichage PDF - Dans un cas réel, nous utiliserions un composant comme react-pdf */}
          <div className={`text-center px-8 py-12 transition-colors duration-300 ${darkMode ? 'text-gray-200' : ''}`}>
            <div className="flex justify-center mb-4">
              <FileIcon type={document.type} />
            </div>
            <p className="text-lg font-semibold">{document.nom}</p>
            <p className={`text-sm my-2 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Document {document.type !== 'pdf' ? formatDocumentType(document.type) : 'PDF'}
            </p>
            <p className={`mt-4 transition-colors duration-300 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              L'aperçu du PDF n'est pas disponible dans cette version.
              <br/>Dans une implémentation complète, le contenu du PDF serait affiché ici.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || totalPages <= 1}
                className={darkMode ? 'border-gray-600 hover:bg-gray-600' : ''}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Page précédente
              </Button>
              <span className={`px-2 py-1 border rounded transition-colors duration-300 ${darkMode ? 'border-gray-600 text-gray-300' : ''}`}>
                Page {currentPage} sur {totalPages}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || totalPages <= 1} 
                className={darkMode ? 'border-gray-600 hover:bg-gray-600' : ''}
              >
                Page suivante <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
          
          {activeTab === 'annotations' && (
            <DocumentAnnotationLayer documentId={document.id} />
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentPreviewTab;
