
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import { DocumentDossier } from '@/types';

export function useDocumentProcessing() {
  const { addDocument, getDossierById, updateDocument, getDocumentsByDossierId } = useData();
  const { toast } = useToast();

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
  
  // Fonction pour mettre à jour un document existant
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
  
  // Récupère l'ID du dernier dossier créé depuis localStorage
  const getLatestDossierId = () => {
    try {
      const latestDossiers = JSON.parse(localStorage.getItem('dossiers') || '[]');
      if (latestDossiers.length > 0) {
        const latestDossier = latestDossiers[latestDossiers.length - 1];
        console.log("Dernier dossier trouvé:", latestDossier);
        return latestDossier?.id;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du dernier dossier:', error);
    }
    return null;
  };
  
  // Détermine le type de document en fonction du nom du fichier
  const determineDocumentType = (fileName: string): string => {
    const lowerFileName = fileName.toLowerCase();
    
    if (lowerFileName.includes('registre') || lowerFileName.includes('rccm')) {
      return 'registre_commerce';
    } else if (lowerFileName.includes('contribuable') || lowerFileName.includes('niu')) {
      return 'carte_contribuable';
    } else if (lowerFileName.includes('processus') || lowerFileName.includes('production')) {
      return 'processus_production';
    } else if (lowerFileName.includes('personnel') || lowerFileName.includes('liste')) {
      return 'liste_personnel';
    } else if (lowerFileName.includes('plan') || lowerFileName.includes('localisation')) {
      return 'plan_localisation';
    } else if (lowerFileName.includes('certificat') || lowerFileName.includes('conform')) {
      return 'certificats_conformite';
    }
    
    return 'pdf'; // Type par défaut
  };

  // Récupère tous les documents pour un type spécifique dans un dossier
  const getDocumentsByType = (dossierId: string, documentType: string): DocumentDossier[] => {
    const dossierDocuments = getDocumentsByDossierId(dossierId);
    return dossierDocuments.filter(doc => doc.type === documentType);
  };

  // Vérifie si les documents requis sont présents et valides
  const checkRequiredDocuments = (dossierId: string): { isComplete: boolean, missingTypes: string[] } => {
    const requiredTypes = [
      'registre_commerce',
      'carte_contribuable',
      'processus_production',
      'liste_personnel',
      'plan_localisation'
    ];
    
    const dossierDocuments = getDocumentsByDossierId(dossierId);
    const validDocuments = dossierDocuments.filter(doc => doc.status === 'valide');
    
    const presentTypes = validDocuments.map(doc => doc.type);
    const missingTypes = requiredTypes.filter(type => !presentTypes.includes(type));
    
    return {
      isComplete: missingTypes.length === 0,
      missingTypes
    };
  };

  return { 
    processAttachments,
    updateDocumentWithMetadata,
    getDocumentsByType,
    checkRequiredDocuments
  };
}
