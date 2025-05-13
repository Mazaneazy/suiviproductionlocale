
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { RapportInspection } from '@/types';
import { useData } from '@/contexts/DataContext';

export function useRapportSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { updateInspection } = useData();

  const submitRapport = async (rapport: RapportInspection) => {
    setIsSubmitting(true);
    
    try {
      // Simuler l'envoi du rapport
      console.log("Soumission du rapport:", rapport);
      
      // Dans une vraie application, on enverrait le rapport à l'API
      // await api.rapports.submit(rapport);
      
      // Mise à jour de l'inspection associée
      if (rapport.inspectionId) {
        updateInspection(rapport.inspectionId, {
          status: 'realisee',
          resultat: rapport.resultat_conformite,
          rapport_url: rapport.fichier_url
        });
      }
      
      // Notification de succès
      toast({
        title: "Rapport soumis avec succès",
        description: `Le rapport a été transmis pour validation`,
      });
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la soumission du rapport:", error);
      
      toast({
        title: "Erreur de soumission",
        description: "Une erreur s'est produite lors de l'envoi du rapport",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitRapport,
    isSubmitting
  };
}
