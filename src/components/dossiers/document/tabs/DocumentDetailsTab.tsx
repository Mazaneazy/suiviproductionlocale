
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocumentDossier } from '@/types';
import { formatDocumentType } from '@/utils/documentTypeUtils';
import { useToast } from '@/hooks/use-toast';

interface DocumentDetailsTabProps {
  document: DocumentDossier;
  darkMode?: boolean;
}

const DocumentDetailsTab: React.FC<DocumentDetailsTabProps> = ({ document, darkMode = false }) => {
  const { toast } = useToast();
  
  const handleDownload = () => {
    toast({
      title: "Téléchargement initialisé",
      description: `Le document ${document.nom} va être téléchargé`,
    });
  };
  
  return (
    <div className={`rounded-md p-4 transition-colors duration-300 ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white'}`}>
      <div className="space-y-4">
        <div>
          <h4 className={`font-medium transition-colors duration-300 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Informations sur le document</h4>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className={`border p-2 rounded-md transition-colors duration-300 ${darkMode ? 'border-gray-700' : ''}`}>
              <p className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nom du fichier</p>
              <p className="font-medium">{document.nom}</p>
            </div>
            <div className={`border p-2 rounded-md transition-colors duration-300 ${darkMode ? 'border-gray-700' : ''}`}>
              <p className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Type de document</p>
              <p className="font-medium">{formatDocumentType(document.type)}</p>
            </div>
            <div className={`border p-2 rounded-md transition-colors duration-300 ${darkMode ? 'border-gray-700' : ''}`}>
              <p className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Date d'ajout</p>
              <p className="font-medium">{new Date(document.dateUpload).toLocaleDateString('fr-FR', { 
                day: '2-digit', 
                month: 'long', 
                year: 'numeric' 
              })}</p>
            </div>
            <div className={`border p-2 rounded-md transition-colors duration-300 ${darkMode ? 'border-gray-700' : ''}`}>
              <p className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Statut</p>
              <p className={`font-medium ${
                document.status === 'valide' ? 'text-green-600' : 
                document.status === 'rejete' ? 'text-red-600' : 
                'text-yellow-600'}`}>
                {document.status === 'valide' ? 'Validé' : 
                 document.status === 'rejete' ? 'Rejeté' : 
                 'En attente de validation'}
              </p>
            </div>
          </div>
        </div>
        
        {document.commentaire && (
          <div>
            <h4 className={`font-medium transition-colors duration-300 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Commentaires</h4>
            <div className={`mt-2 p-3 rounded-md border transition-colors duration-300 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border'}`}>
              {document.commentaire}
            </div>
          </div>
        )}
        
        <div>
          <h4 className={`font-medium transition-colors duration-300 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Actions</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownload}
              className={darkMode ? 'border-gray-600 hover:bg-gray-700' : ''}
            >
              <Download className="h-4 w-4 mr-2" />
              Télécharger le document
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetailsTab;
