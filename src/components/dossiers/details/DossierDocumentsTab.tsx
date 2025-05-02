
import React from 'react';
import { DocumentDossier } from '@/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { File, FileText } from 'lucide-react';

interface DossierDocumentsTabProps {
  documents: DocumentDossier[];
}

const DossierDocumentsTab: React.FC<DossierDocumentsTabProps> = ({ documents }) => {
  // Format document type name for better display
  const formatDocumentType = (type: string) => {
    switch (type) {
      case 'registre_commerce':
        return 'Registre de Commerce';
      case 'carte_contribuable':
        return 'Carte de Contribuable (NIU)';
      case 'processus_production':
        return 'Schéma du processus de production';
      case 'certificats_conformite':
        return 'Certificats de Conformité';
      case 'liste_personnel':
        return 'Liste du personnel';
      case 'plan_localisation':
        return 'Plan de localisation';
      default:
        return type;
    }
  };

  // Helper function to view a PDF document
  const viewDocument = (url: string, name: string) => {
    window.open(url, `_blank_${name}`);
  };

  console.log("Rendering DossierDocumentsTab with documents:", documents);

  return (
    <ScrollArea className="h-full pr-4">
      {documents && documents.length > 0 ? (
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md bg-white shadow-sm">
              <div className="flex items-center">
                {doc.type === 'pdf' ? (
                  <File className="mr-3 text-red-500" size={20} />
                ) : (
                  <FileText className="mr-3 text-certif-blue" size={20} />
                )}
                <div>
                  <div className="font-medium">
                    {doc.type !== 'pdf' ? formatDocumentType(doc.type) : doc.nom}
                  </div>
                  <div className="text-sm text-gray-500">
                    Téléversé le {new Date(doc.dateUpload).toLocaleDateString()}
                  </div>
                  {doc.status && (
                    <div className={`text-xs mt-1 font-medium ${
                      doc.status === 'valide' ? 'text-green-500' : 
                      doc.status === 'rejete' ? 'text-red-500' : 
                      'text-yellow-500'
                    }`}>
                      {doc.status === 'valide' ? 'Validé' : 
                       doc.status === 'rejete' ? 'Rejeté' : 
                       'En attente'}
                    </div>
                  )}
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => viewDocument(doc.url, doc.nom)}
              >
                {doc.type === 'pdf' ? 'Visualiser' : 'Télécharger'}
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-4 text-gray-500 bg-gray-50 rounded-md">
          <FileText className="mx-auto mb-3 text-gray-400" size={40} />
          <p className="text-lg font-medium">Aucune pièce jointe disponible</p>
          <p className="mt-1">Aucun document n'a encore été téléversé pour ce dossier.</p>
        </div>
      )}
    </ScrollArea>
  );
};

export default DossierDocumentsTab;
