
import React, { useState } from 'react';
import { DocumentDossier } from '@/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useData } from '@/contexts/DataContext';
import { formatDocumentType } from '@/utils/documentTypeUtils';

// Import our new component files
import DocumentViewerDialog from './documents/DocumentViewerDialog';
import DocumentFilters from './documents/DocumentFilters';
import DocumentList from './documents/DocumentList';
import DocumentGrid from './documents/DocumentGrid';
import EmptyDocumentState from './documents/EmptyDocumentState';

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
  
  // Check if user has the necessary role to view documents
  const canViewDocuments = hasRole(['responsable_technique', 'chef_mission', 'directeur', 'directeur_general', 'gestionnaire']);

  // Helper function to view a document
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

  // Ensure documents is an array even if it's undefined
  const docsToDisplay = Array.isArray(documents) ? documents : [];

  // Filter documents based on search and type filter
  const filteredDocuments = docsToDisplay.filter(doc => {
    const matchesSearch = doc.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       formatDocumentType(doc.type).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'tous' || doc.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  // Group documents by type for the grid view
  const groupedDocuments: Record<string, DocumentDossier[]> = {};
  filteredDocuments.forEach(doc => {
    const type = doc.type;
    if (!groupedDocuments[type]) {
      groupedDocuments[type] = [];
    }
    groupedDocuments[type].push(doc);
  });

  // Show appropriate state based on conditions
  if (!canViewDocuments || isLoading || docsToDisplay.length === 0) {
    return (
      <EmptyDocumentState
        isLoading={isLoading}
        canViewDocuments={canViewDocuments}
        dossierId={dossierId}
        onRefresh={handleRefreshDocuments}
      />
    );
  }

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

        <DocumentFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
        />

        <Tabs defaultValue="liste" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="liste">Liste</TabsTrigger>
            <TabsTrigger value="categories">Catégories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="liste" className="space-y-3">
            <DocumentList
              documents={filteredDocuments}
              onViewDocument={viewDocument}
            />
          </TabsContent>
          
          <TabsContent value="categories">
            <DocumentGrid
              groupedDocuments={groupedDocuments}
              onViewDocument={viewDocument}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      <DocumentViewerDialog
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        document={selectedDocument}
      />
    </>
  );
};

export default DossierDocumentsTab;
