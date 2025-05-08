
import React, { useState } from 'react';
import { DocumentDossier } from '@/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { File, FileText, Download, Paperclip, Eye, Search, ListFilter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useData } from '@/contexts/DataContext';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DocumentViewer from '../document/DocumentViewer';

interface DossierDocumentsTabProps {
  documents: DocumentDossier[];
  isLoading?: boolean;
  dossierId?: string;
}

const DossierDocumentsTab: React.FC<DossierDocumentsTabProps> = ({ 
  documents, 
  isLoading = false,
  dossierId 
}) => {
  const { toast } = useToast();
  const { hasRole } = useAuth();
  const { getDocumentsByDossierId } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('tous');
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentDossier | null>(null);
  
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

  // Filtrer les documents en fonction de la recherche et du filtre par type
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         formatDocumentType(doc.type).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'tous' || doc.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  // Regrouper les documents par type pour un affichage organisé
  const groupedDocuments: Record<string, DocumentDossier[]> = {};
  filteredDocuments.forEach(doc => {
    const type = doc.type;
    if (!groupedDocuments[type]) {
      groupedDocuments[type] = [];
    }
    groupedDocuments[type].push(doc);
  });

  // Helper function to view a PDF document
  const viewDocument = (doc: DocumentDossier) => {
    setSelectedDocument(doc);
    setViewerOpen(true);
  };
  
  // Handler to manually refresh documents
  const handleRefreshDocuments = () => {
    if (!dossierId) return;
    
    try {
      // Try to get directly from localStorage for most recent data
      const storedDocuments = localStorage.getItem('documents');
      if (storedDocuments) {
        const allDocuments = JSON.parse(storedDocuments);
        if (Array.isArray(allDocuments)) {
          const filteredDocs = allDocuments.filter(doc => doc.dossierId === dossierId);
          console.log(`Manually refreshed: Found ${filteredDocs.length} documents for dossier ${dossierId}`);
          
          // Trigger update event
          window.dispatchEvent(new CustomEvent('documents-updated', { 
            detail: { dossierId } 
          }));
          
          toast({
            title: "Documents actualisés",
            description: `${filteredDocs.length} document(s) pour ce dossier`,
          });
          
          return;
        }
      }
      
      // If localStorage fails, use the context function
      const refreshedDocs = getDocumentsByDossierId(dossierId);
      console.log("Documents refreshed via context:", refreshedDocs.length);
      
      toast({
        title: "Documents actualisés",
        description: `${refreshedDocs.length} document(s) pour ce dossier`,
      });
      
    } catch (error) {
      console.error("Erreur lors de l'actualisation des documents:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'actualiser les documents",
        variant: "destructive",
      });
    }
  };

  console.log("Rendering DossierDocumentsTab with documents:", documents?.length || 0);

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

  if (docsToDisplay.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-4 text-center">
        <div>
          <Paperclip className="mx-auto mb-3 text-gray-400" size={40} />
          <p className="text-lg font-medium text-gray-600">Aucune pièce jointe</p>
          <p className="mt-1 text-gray-500">Ce dossier ne contient pas encore de pièces jointes.</p>
          
          {dossierId && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={handleRefreshDocuments}
            >
              Actualiser les documents
            </Button>
          )}
        </div>
      </div>
    );
  }

  const documentTypes = [
    { value: 'tous', label: 'Tous les types' },
    { value: 'registre_commerce', label: 'Registre de Commerce' },
    { value: 'carte_contribuable', label: 'Carte de Contribuable' },
    { value: 'processus_production', label: 'Processus de production' },
    { value: 'certificats_conformite', label: 'Certificats' },
    { value: 'liste_personnel', label: 'Liste du personnel' },
    { value: 'plan_localisation', label: 'Plan de localisation' },
    { value: 'pdf', label: 'Autres documents' }
  ];

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">
            Pièces jointes ({docsToDisplay.length})
          </h3>
          
          {dossierId && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefreshDocuments}
            >
              Actualiser
            </Button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Rechercher un document..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <ListFilter className="h-4 w-4 text-gray-400" />
            <select 
              className="border rounded px-2 py-2 text-sm"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              {documentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Tabs defaultValue="liste" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="liste">Liste</TabsTrigger>
            <TabsTrigger value="categories">Catégories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="liste" className="space-y-3">
            <ScrollArea className="h-[320px] pr-4">
              {filteredDocuments.map((doc) => (
                <div 
                  key={doc.id} 
                  className={`border rounded-md p-3 mb-3 flex items-center justify-between
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
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => viewDocument(doc)}
                      className="flex-shrink-0"
                    >
                      <Eye size={16} className="mr-1" />
                      Voir
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-shrink-0"
                    >
                      <Download size={16} className="mr-1" />
                      Télécharger
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="categories">
            <ScrollArea className="h-[320px] pr-4">
              {Object.keys(groupedDocuments).length > 0 ? (
                Object.entries(groupedDocuments).map(([type, docs]) => (
                  <div key={type} className="mb-6">
                    <h4 className="font-medium mb-2 flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      {formatDocumentType(type)} ({docs.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-6">
                      {docs.map(doc => (
                        <div 
                          key={doc.id}
                          className={`border text-sm p-2 rounded flex justify-between items-center
                            ${doc.status === 'valide' ? 'bg-green-50 border-green-200' : 
                              doc.status === 'rejete' ? 'bg-red-50 border-red-200' : 
                              'bg-white'}`}
                        >
                          <div className="truncate flex-1">
                            <span className="font-medium">{doc.nom}</span>
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => viewDocument(doc)}
                              className="h-7 w-7 p-0"
                            >
                              <Eye size={14} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-7 w-7 p-0"
                            >
                              <Download size={14} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">
                  Aucun document ne correspond à vos critères de recherche
                </p>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-4">
          <div className="flex-1 overflow-hidden">
            {selectedDocument && (
              <DocumentViewer document={selectedDocument} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DossierDocumentsTab;
