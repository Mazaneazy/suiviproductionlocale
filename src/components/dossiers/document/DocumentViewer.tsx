
import React, { useState } from 'react';
import { DocumentDossier } from '@/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut, MessageSquare, PenLine } from 'lucide-react';
import { DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import DocumentAnnotationLayer from './DocumentAnnotationLayer';
import DocumentComments from './DocumentComments';

interface DocumentViewerProps {
  document: DocumentDossier;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document }) => {
  const { toast } = useToast();
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('preview');

  // Dans un environnement réel, nous aurions un vrai lecteur PDF
  // Ici, nous simulons l'affichage d'un PDF
  const handleDownload = () => {
    toast({
      title: "Téléchargement initialisé",
      description: `Le document ${document.nom} va être téléchargé`,
    });
  };

  const handleZoomIn = () => {
    if (zoom < 2) {
      setZoom(zoom + 0.25);
    }
  };

  const handleZoomOut = () => {
    if (zoom > 0.5) {
      setZoom(zoom - 0.25);
    }
  };

  const handleRotate = () => {
    setRotation((rotation + 90) % 360);
  };

  // Fonction pour formater le type de document
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <DialogTitle className="text-lg">
          {document.type !== 'pdf' ? formatDocumentType(document.type) : document.nom}
        </DialogTitle>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm">{Math.round(zoom * 100)}%</span>
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="preview" className="flex-1 flex flex-col" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-2">
          <TabsTrigger value="preview">Aperçu</TabsTrigger>
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="annotations" className="flex items-center gap-1">
            <PenLine className="h-4 w-4" />
            Annotations
          </TabsTrigger>
          <TabsTrigger value="comments" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            Commentaires
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="flex-1 overflow-auto bg-gray-100 rounded-md p-4">
          <div 
            className="mx-auto bg-white shadow-md flex items-center justify-center relative"
            style={{ 
              maxWidth: `${Math.min(100, 80 * zoom)}%`, 
              minHeight: '400px',
              transform: `rotate(${rotation}deg)`,
              transition: 'transform 0.3s ease, max-width 0.3s ease'
            }}
          >
            {/* Simulation d'affichage PDF - Dans un cas réel, nous utiliserions un composant comme react-pdf */}
            <div className="text-center px-8 py-12">
              <div className="flex justify-center mb-4">
                <FileIcon type={document.type} />
              </div>
              <p className="text-lg font-semibold">{document.nom}</p>
              <p className="text-sm text-gray-500 my-2">
                Document {document.type !== 'pdf' ? formatDocumentType(document.type) : 'PDF'}
              </p>
              <p className="text-gray-400 mt-4">
                L'aperçu du PDF n'est pas disponible dans cette version.
                <br/>Dans une implémentation complète, le contenu du PDF serait affiché ici.
              </p>
              <div className="mt-8 flex justify-center space-x-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Page précédente
                </Button>
                <span className="px-2 py-1 border rounded">
                  Page {currentPage} sur {1}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={true} // Dans un vrai PDF, nous vérifierions s'il y a d'autres pages
                >
                  Page suivante <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
            
            {activeTab === 'annotations' && (
              <DocumentAnnotationLayer documentId={document.id} />
            )}
          </div>
        </TabsContent>

        <TabsContent value="details" className="bg-white rounded-md p-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700">Informations sur le document</h4>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="border p-2 rounded-md">
                  <p className="text-sm text-gray-500">Nom du fichier</p>
                  <p className="font-medium">{document.nom}</p>
                </div>
                <div className="border p-2 rounded-md">
                  <p className="text-sm text-gray-500">Type de document</p>
                  <p className="font-medium">{formatDocumentType(document.type)}</p>
                </div>
                <div className="border p-2 rounded-md">
                  <p className="text-sm text-gray-500">Date d'ajout</p>
                  <p className="font-medium">{new Date(document.dateUpload).toLocaleDateString('fr-FR', { 
                    day: '2-digit', 
                    month: 'long', 
                    year: 'numeric' 
                  })}</p>
                </div>
                <div className="border p-2 rounded-md">
                  <p className="text-sm text-gray-500">Statut</p>
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
                <h4 className="font-medium text-gray-700">Commentaires</h4>
                <div className="mt-2 p-3 bg-gray-50 rounded-md border">
                  {document.commentaire}
                </div>
              </div>
            )}
            
            <div>
              <h4 className="font-medium text-gray-700">Actions</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger le document
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="annotations" className="bg-white rounded-md p-4">
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
        </TabsContent>
        
        <TabsContent value="comments" className="bg-white rounded-md p-4">
          <DocumentComments documentId={document.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Composant d'icône pour les types de documents
const FileIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'registre_commerce':
      return <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">RC</div>;
    case 'carte_contribuable':
      return <div className="w-16 h-16 rounded-lg bg-green-100 flex items-center justify-center text-green-600">NIU</div>;
    case 'processus_production':
      return <div className="w-16 h-16 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">PP</div>;
    case 'certificats_conformite':
      return <div className="w-16 h-16 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">CC</div>;
    case 'liste_personnel':
      return <div className="w-16 h-16 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">LP</div>;
    case 'plan_localisation':
      return <div className="w-16 h-16 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600">PL</div>;
    default:
      return <div className="w-16 h-16 rounded-lg bg-red-100 flex items-center justify-center text-red-600">PDF</div>;
  }
};

export default DocumentViewer;
