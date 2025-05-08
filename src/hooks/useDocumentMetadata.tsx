
import { useToast } from '@/hooks/use-toast';
import { DocumentDossier } from '@/types';

/**
 * Hook for managing document metadata
 */
export function useDocumentMetadata(updateDocument: (docId: string, metadata: Record<string, any>) => void) {
  const { toast } = useToast();

  /**
   * Updates an existing document with metadata
   */
  const updateDocumentWithMetadata = (docId: string, metadata: Record<string, any>) => {
    try {
      updateDocument(docId, metadata);
      
      // Récupérer le document mis à jour
      const storedDocuments = localStorage.getItem('documents');
      if (storedDocuments) {
        const allDocs = JSON.parse(storedDocuments);
        const updatedDoc = allDocs.find((doc: any) => doc.id === docId);
        
        if (updatedDoc) {
          console.log(`Document mis à jour: ${updatedDoc.nom} (ID: ${updatedDoc.id})`);
          
          // Déclencher un événement pour signaler la mise à jour
          window.dispatchEvent(new CustomEvent('documents-updated', { 
            detail: { dossierId: updatedDoc.dossierId } 
          }));
          
          toast({
            title: "Document mis à jour",
            description: `Les métadonnées du document ont été mises à jour`,
          });
          
          return updatedDoc;
        }
      }
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du document ${docId}:`, error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le document",
        variant: "destructive",
      });
    }
    
    return null;
  };

  return { updateDocumentWithMetadata };
}
