
import { DocumentDossier } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export function useDocumentValidation() {
  const { toast } = useToast();
  const [validationStatuses, setValidationStatuses] = useState<Record<string, string>>({});
  
  // Vérifier que les documents requis sont présents
  const checkRequiredDocuments = (
    dossierId: string, 
    getDocumentsByDossierId: (id: string) => DocumentDossier[]
  ) => {
    const documents = getDocumentsByDossierId(dossierId);
    
    // Liste des types de documents requis
    const requiredTypes = [
      'registre_commerce',
      'carte_contribuable',
      'processus_production',
      'liste_personnel',
      'plan_localisation'
    ];
    
    // Vérifier que chaque type de document requis est présent
    const missingDocuments = requiredTypes.filter(type => 
      !documents.some(doc => doc.type === type && doc.status !== 'rejete')
    );
    
    return {
      isComplete: missingDocuments.length === 0,
      missingDocuments,
      validDocumentsCount: documents.filter(doc => doc.status === 'valide').length,
      totalRequiredCount: requiredTypes.length
    };
  };

  // Obtenir les documents par type
  const getDocumentsByType = (
    dossierId: string, 
    documentType: string,
    getDocumentsByDossierId: (id: string) => DocumentDossier[]
  ): DocumentDossier[] => {
    const documents = getDocumentsByDossierId(dossierId);
    return documents.filter(doc => doc.type === documentType);
  };
  
  // Valider un document
  const validateDocument = (
    documentId: string, 
    status: 'valide' | 'rejete', 
    commentaire: string = '',
    updateDocument: (id: string, data: Partial<DocumentDossier>) => void
  ) => {
    // Enregistrer le statut de validation localement
    setValidationStatuses(prev => ({
      ...prev,
      [documentId]: status
    }));
    
    // Mettre à jour le document dans le contexte
    updateDocument(documentId, {
      status,
      commentaire
    });
    
    // Notification
    toast({
      title: status === 'valide' ? 'Document validé' : 'Document rejeté',
      description: status === 'valide' 
        ? 'Ce document a été validé avec succès'
        : `Ce document a été rejeté${commentaire ? ': ' + commentaire : ''}`,
      variant: status === 'valide' ? 'default' : 'destructive',
    });
    
    return true;
  };

  return {
    checkRequiredDocuments,
    getDocumentsByType,
    validateDocument,
    validationStatuses
  };
}
