
import { DocumentDossier } from '@/types';

export function useDocumentMetadata(updateDocument: (id: string, data: Partial<DocumentDossier>) => void) {
  // Mettre à jour les métadonnées d'un document
  const updateDocumentWithMetadata = (
    documentId: string, 
    metadata: {
      status?: 'valide' | 'rejete' | 'en_attente';
      commentaire?: string;
    }
  ) => {
    updateDocument(documentId, metadata);
  };

  return {
    updateDocumentWithMetadata
  };
}
