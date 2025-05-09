
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import { DocumentDossier } from '@/types';
import { determineDocumentType } from '@/utils/documentTypeUtils';
import { getLatestDossierId } from '@/utils/dossierUtils';
import { useDocumentValidation } from './useDocumentValidation';
import { useDocumentMetadata } from './useDocumentMetadata';
import { useRapportSubmission } from './useRapportSubmission';

export function useDocumentProcessing() {
  const { addDocument, getDocumentsByDossierId, updateDocument } = useData();
  const { toast } = useToast();
  const { checkRequiredDocuments, getDocumentsByType } = useDocumentValidation();
  const { updateDocumentWithMetadata } = useDocumentMetadata(updateDocument);
  const { submitRapport } = useRapportSubmission();

  const processAttachments = (attachments: File[], dossierId?: string) => {
    if (attachments.length === 0) return [];
    
    console.log(`Traitement de ${attachments.length} pièces jointes pour le dossier ${dossierId || 'inconnu'}`);
    
    if (!dossierId) {
      dossierId = getLatestDossierId();
      console.log(`ID de dossier fourni non valide, utilisation de l'ID récupéré: ${dossierId}`);
    }
    
    if (!dossierId) {
      console.error("Impossible de trouver un ID de dossier valide pour ajouter les pièces jointes");
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter les pièces jointes. ID de dossier non valide.",
        variant: "destructive",
      });
      return [];
    }
    
    const addedDocuments: DocumentDossier[] = [];
    
    // Traitement immédiat des pièces jointes
    attachments.forEach((file) => {
      // Déterminer le type de document en fonction du nom du fichier
      let documentType = determineDocumentType(file.name);
      
      // Vérifier si un document de ce type existe déjà pour éviter les doublons
      const existingDocuments = getDocumentsByDossierId(dossierId as string);
      const duplicateDoc = existingDocuments.find(doc => 
        doc.type === documentType && documentType !== 'pdf'
      );
      
      if (duplicateDoc) {
        console.log(`Document de type ${documentType} déjà existant, traitement comme document générique`);
        // Si c'est un doublon pour un type spécifique, le traiter comme un pdf générique
        documentType = 'pdf';
      }
      
      // Créer une URL fictive pour le fichier PDF
      const fileUrl = `https://storage.example.com/${dossierId}/${file.name}`;
      
      // Créer l'objet document avec le statut en attente
      const newDocData: Omit<DocumentDossier, 'id'> = {
        dossierId: dossierId as string,
        nom: file.name,
        type: documentType,
        dateUpload: new Date().toISOString(),
        url: fileUrl,
        status: 'en_attente' // Using a specific string literal that matches the expected type
      };
      
      try {
        // Ajouter le document au dossier (sans attendre de retour)
        addDocument(newDocData);
        console.log(`Document ajouté: ${file.name}`);
        
        // Récupérer le document depuis le localStorage pour confirmer l'ajout
        const storedDocuments = localStorage.getItem('documents');
        if (storedDocuments) {
          const allDocs = JSON.parse(storedDocuments);
          // Chercher le document qui correspond aux données qu'on vient d'ajouter
          const newDoc = allDocs.find((doc: any) => 
            doc.dossierId === newDocData.dossierId && 
            doc.nom === newDocData.nom &&
            doc.dateUpload === newDocData.dateUpload
          );
          
          if (newDoc) {
            addedDocuments.push(newDoc);
            console.log(`Document récupéré depuis localStorage: ${newDoc.nom} (ID: ${newDoc.id})`);
          }
        }
      } catch (error) {
        console.error(`Erreur lors de l'ajout du document ${file.name}:`, error);
      }
      
      console.log(`Document traité: ${file.name} (Type: ${documentType}) pour le dossier ${dossierId}`);
    });
    
    // Notification du succès
    if (addedDocuments.length > 0) {
      toast({
        title: "Pièces jointes ajoutées",
        description: `${addedDocuments.length} fichier(s) ajouté(s) au dossier`,
      });
      
      // Déclencher un événement pour signaler que les documents ont été mis à jour
      window.dispatchEvent(new CustomEvent('documents-updated', { 
        detail: { dossierId } 
      }));
    }
    
    return addedDocuments;
  };

  return { 
    processAttachments,
    updateDocumentWithMetadata,
    getDocumentsByType: (dossierId: string, documentType: string) => 
      getDocumentsByType(dossierId, documentType, getDocumentsByDossierId),
    checkRequiredDocuments: (dossierId: string) => 
      checkRequiredDocuments(dossierId, getDocumentsByDossierId),
    submitRapport
  };
}
