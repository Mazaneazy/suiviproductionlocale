
import React from 'react';
import { DocumentDossier } from '@/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { File, FileText, Download, Paperclip } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface DossierDocumentsTabProps {
  documents: DocumentDossier[];
}

const DossierDocumentsTab: React.FC<DossierDocumentsTabProps> = ({ documents }) => {
  const { toast } = useToast();
  const { hasRole } = useAuth();
  
  // Vérifier si l'utilisateur a le rôle nécessaire pour voir les documents
  const canViewDocuments = hasRole(['responsable_technique', 'chef_mission', 'directeur', 'directeur_general', 'gestionnaire']);

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
    // Dans un environnement réel, ceci ouvrirait le PDF dans une nouvelle fenêtre
    window.open(url, `_blank_${name}`);
    
    // Comme nous utilisons des URL fictives, affichons un message
    toast({
      title: "Visualisation du document",
      description: `Ouverture de ${name}`,
    });
  };

  console.log("Rendering DossierDocumentsTab with documents:", documents);

  // S'assurer que documents est un tableau même s'il est undefined
  const docsToDisplay = Array.isArray(documents) ? documents : [];

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

  if (docsToDisplay.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-4 text-center">
        <div>
          <Paperclip className="mx-auto mb-3 text-gray-400" size={40} />
          <p className="text-lg font-medium text-gray-600">Aucune pièce jointe</p>
          <p className="mt-1 text-gray-500">Ce dossier ne contient pas encore de pièces jointes.</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">
            Pièces jointes ({docsToDisplay.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {docsToDisplay.map((doc) => (
            <div 
              key={doc.id} 
              className={`border rounded-md p-3 flex items-center justify-between
                ${doc.status === 'valide' ? 'bg-green-50 border-green-200' : 
                  doc.status === 'rejete' ? 'bg-red-50 border-red-200' : 
                  'bg-white'}`}
            >
              <div className="flex items-center space-x-3">
                {doc.type === 'pdf' ? (
                  <File className="text-red-500 flex-shrink-0" size={24} />
                ) : (
                  <FileText className="text-certif-blue flex-shrink-0" size={24} />
                )}
                <div>
                  <p className="font-medium">
                    {doc.type !== 'pdf' ? formatDocumentType(doc.type) : doc.nom}
                  </p>
                  <p className="text-sm text-gray-500">
                    Téléversé le {new Date(doc.dateUpload).toLocaleDateString()}
                  </p>
                  {doc.status && (
                    <span className={`text-xs px-2 py-1 rounded-full inline-block mt-1
                      ${doc.status === 'valide' ? 'bg-green-100 text-green-700' : 
                        doc.status === 'rejete' ? 'bg-red-100 text-red-700' : 
                        'bg-yellow-100 text-yellow-700'}`}>
                      {doc.status === 'valide' ? 'Validé' : 
                        doc.status === 'rejete' ? 'Rejeté' : 'En attente'}
                    </span>
                  )}
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => viewDocument(doc.url, doc.nom)}
                className="flex-shrink-0"
              >
                <Download size={16} className="mr-2" />
                Visualiser
              </Button>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default DossierDocumentsTab;
