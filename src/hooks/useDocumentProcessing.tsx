
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';

export function useDocumentProcessing() {
  const { addDocument } = useData();
  const { toast } = useToast();

  const processAttachments = (attachments: File[]) => {
    if (attachments.length === 0) return;

    setTimeout(() => {
      const latestDossiers = JSON.parse(localStorage.getItem('dossiers') || '[]');
      const latestDossier = latestDossiers.length > 0 ? latestDossiers[latestDossiers.length - 1] : null;
      
      if (latestDossier && attachments.length > 0) {
        attachments.forEach((file) => {
          // Déterminer le type de document en fonction du nom du fichier
          let documentType = 'pdf';
          
          // Vérification basique du nom du fichier pour déterminer le type
          const fileName = file.name.toLowerCase();
          if (fileName.includes('registre') || fileName.includes('rccm')) {
            documentType = 'registre_commerce';
          } else if (fileName.includes('contribuable') || fileName.includes('niu')) {
            documentType = 'carte_contribuable';
          } else if (fileName.includes('processus') || fileName.includes('production')) {
            documentType = 'processus_production';
          } else if (fileName.includes('personnel') || fileName.includes('liste')) {
            documentType = 'liste_personnel';
          } else if (fileName.includes('plan') || fileName.includes('localisation')) {
            documentType = 'plan_localisation';
          }
          
          // Créer une URL fictive pour le fichier PDF (dans une vraie application, ce serait une URL de stockage cloud)
          const fileUrl = `https://storage.example.com/${latestDossier.id}/${file.name}`;
          
          // Ajouter le document au dossier avec le statut en attente par défaut
          addDocument({
            dossierId: latestDossier.id,
            nom: file.name,
            type: documentType,
            dateUpload: new Date().toISOString(),
            url: fileUrl,
            status: 'en_attente'
          });
        });
        
        toast({
          title: "Pièces jointes ajoutées",
          description: `${attachments.length} fichier(s) ajouté(s) au dossier`,
        });
      }
    }, 500);
  };

  return { processAttachments };
}
