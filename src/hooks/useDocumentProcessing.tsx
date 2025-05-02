
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';

export function useDocumentProcessing() {
  const { addDocument, getDossierById } = useData();
  const { toast } = useToast();

  const processAttachments = (attachments: File[], dossierId?: string) => {
    if (attachments.length === 0) return;

    // Récupérer le dernier dossier créé ou utiliser l'ID fourni
    setTimeout(() => {
      const latestDossierId = dossierId || getLatestDossierId();
      
      if (latestDossierId && attachments.length > 0) {
        console.log(`Traitement de ${attachments.length} pièces jointes pour le dossier ${latestDossierId}`);
        
        attachments.forEach((file) => {
          // Déterminer le type de document en fonction du nom du fichier
          let documentType = determineDocumentType(file.name);
          
          // Créer une URL fictive pour le fichier PDF
          const fileUrl = `https://storage.example.com/${latestDossierId}/${file.name}`;
          
          // Ajouter le document au dossier avec le statut en attente par défaut
          addDocument({
            dossierId: latestDossierId,
            nom: file.name,
            type: documentType,
            dateUpload: new Date().toISOString(),
            url: fileUrl,
            status: 'en_attente'
          });
          
          console.log(`Document ajouté: ${file.name} (Type: ${documentType}) pour le dossier ${latestDossierId}`);
        });
        
        toast({
          title: "Pièces jointes ajoutées",
          description: `${attachments.length} fichier(s) ajouté(s) au dossier`,
        });
      } else {
        console.error("Impossible de trouver un ID de dossier valide pour ajouter les pièces jointes");
      }
    }, 500);
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
