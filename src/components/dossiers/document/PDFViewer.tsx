
import React, { useState, useEffect } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';

interface PDFViewerProps {
  pdfUrl: string;
  darkMode?: boolean;
}

// Ce composant est une simulation de visualisation PDF
// Dans un cas réel, on utiliserait react-pdf ou un composant similaire
const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, darkMode = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simule le chargement d'un PDF
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Simuler un document avec un nombre aléatoire de pages
      setTotalPages(Math.floor(Math.random() * 5) + 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [pdfUrl]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDownload = () => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className={`flex flex-col h-full transition-colors ${darkMode ? 'text-white' : ''}`}>
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner className="w-6 h-6 text-certif-blue" />
          <span className="ml-2">Chargement du document...</span>
        </div>
      ) : (
        <>
          <div className="flex-1 flex items-center justify-center bg-gray-100 p-4 rounded-md">
            <div className={`bg-white shadow-md p-8 max-w-md mx-auto text-center ${darkMode ? 'bg-gray-800 text-white' : ''}`}>
              <h3 className="text-lg font-medium mb-4">
                Page {currentPage} / {totalPages}
              </h3>
              <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Aperçu du document PDF
              </p>
              <div className={`border-2 p-8 mb-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <p>Contenu de la page {currentPage}</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Dans une implémentation réelle, le contenu du PDF serait rendu ici.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 px-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className={darkMode ? 'border-gray-600 text-gray-300' : ''}
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Page précédente
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className={`${darkMode ? 'border-gray-600 text-gray-300' : ''}`}
            >
              <Download className="mr-1 h-4 w-4" /> Télécharger
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className={darkMode ? 'border-gray-600 text-gray-300' : ''}
            >
              Page suivante <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default PDFViewer;
