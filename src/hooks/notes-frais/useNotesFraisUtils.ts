
import { NoteFrais } from '@/types';

export const useNotesFraisUtils = () => {
  // Calculer le total d'une note de frais
  const calculerTotal = (note: NoteFrais) => {
    return (
      (note.fraisGestion || 0) + 
      (note.fraisInspection || 0) + 
      (note.fraisAnalyses || 0) + 
      (note.fraisSurveillance || 0)
    );
  };

  // Fonction pour obtenir la couleur du badge en fonction du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_attente':
        return 'bg-yellow-500 text-white';
      case 'valide':
        return 'bg-green-500 text-white';
      case 'rejete':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Fonction pour formater le statut pour l'affichage
  const formatStatus = (status: string) => {
    switch (status) {
      case 'en_attente':
        return 'En attente';
      case 'valide':
        return 'Validée';
      case 'rejete':
        return 'Rejetée';
      default:
        return status;
    }
  };

  return {
    calculerTotal,
    getStatusColor,
    formatStatus
  };
};
