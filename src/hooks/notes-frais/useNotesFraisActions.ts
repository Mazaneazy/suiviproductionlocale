
import { useToast } from '@/hooks/use-toast';
import { NoteFrais } from '@/types';

export const useNotesFraisActions = (
  updateNoteFrais: (id: string, data: Partial<NoteFrais>) => void,
  setSelectedNote: (note: NoteFrais | null) => void,
  setDetailDialogOpen: (open: boolean) => void
) => {
  const { toast } = useToast();

  // Fonction pour simuler l'envoi d'une notification par email
  const handleSendNotification = (noteId: string) => {
    updateNoteFrais(noteId, { 
      notificationEnvoyee: true 
    });
    
    toast({
      title: "Notification envoyée",
      description: "L'opérateur a été notifié de sa note de frais.",
    });
  };

  // Fonction pour marquer comme notifié
  const handleMarkAsNotified = (noteId: string) => {
    updateNoteFrais(noteId, { 
      operateurNotifie: true 
    });
    
    toast({
      title: "Confirmation reçue",
      description: "L'opérateur a confirmé la réception de sa note de frais.",
    });
  };

  // Fonction pour valider une note de frais
  const handleValidateNoteFrais = (id: string) => {
    updateNoteFrais(id, { status: 'valide' });
    toast({
      title: "Note de frais validée",
      description: "La note de frais a été validée avec succès.",
    });
  };

  // Fonction pour rejeter une note de frais
  const handleRejectNoteFrais = (id: string) => {
    updateNoteFrais(id, { status: 'rejete' });
    toast({
      title: "Note de frais rejetée",
      description: "La note de frais a été rejetée.",
    });
  };

  // Afficher les détails d'une note
  const handleShowDetails = (note: NoteFrais) => {
    setSelectedNote(note);
    setDetailDialogOpen(true);
  };

  return {
    handleSendNotification,
    handleMarkAsNotified,
    handleValidateNoteFrais,
    handleRejectNoteFrais,
    handleShowDetails
  };
};
