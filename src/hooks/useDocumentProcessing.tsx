
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import { DocumentDossier } from '@/types';

export function useDocumentProcessing() {
  const { addDocument, getDossierById } = useData();
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
      
      // Créer une URL fictive pour le fichier PDF
      const fileUrl = `https://storage.example.com/${dossierId}/${file.name}`;
      
      // Créer l'objet document avant de l'ajouter pour éviter l'erreur TypeScript
      const newDocData: Omit<DocumentDossier, 'id'> = {
        dossierId: dossierId as string,
        nom: file.name,
        type: documentType,
        dateUpload: new Date().toISOString(),
        url: fileUrl,
        status: 'en_attente' // Using a specific string literal that matches the expected type
      };
      
      // Ajouter le document au dossier avec le statut en attente par défaut
      const result = addDocument(newDocData);
      
      // Obtenir le nouveau document depuis localStorage si addDocument ne retourne pas l'objet
      let newDoc: DocumentDossier | undefined;
      
      try {
        const storedDocuments = localStorage.getItem('documents');
        if (storedDocuments) {
          const allDocs = JSON.parse(storedDocuments);
          // Chercher le document qui correspond aux données qu'on vient d'ajouter
          newDoc = allDocs.find((doc: any) => 
            doc.dossierId === newDocData.dossierId && 
            doc.nom === newDocData.nom &&
            doc.dateUpload === newDocData.dateUpload
          );
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du document depuis localStorage:", error);
      }
      
      // Si on a pu trouver ou créer le document, l'ajouter à notre liste
      if (newDoc) {
        addedDocuments.push(newDoc);
        console.log(`Document ajouté: ${file.name} (Type: ${documentType}) pour le dossier ${dossierId}`);
      }
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
  
  // Récupère l'ID du dernier dossier créé depuis localStorage
  const getLatestDossierId = () => {
    try {
      const latestDossiers = JSON.parse(localStorage.getItem('dossiers') || '[]');
      const latestDossier = latestDossiers.length > 0 ? latestDossiers[latestDossiers.length - 1] : null;
      return latestDossier?.id;
    } catch (error) {
      console.error('Erreur lors de la récupération du dernier dossier:', error);
      return null;
    }
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

  return { processAttachments };
}
