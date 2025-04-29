
import { Dossier, Statistique } from '../../types';

// Fonction utilitaire pour générer des identifiants aléatoires
export const generateId = (): string => Math.random().toString(36).substring(2, 11);

// Fonction utilitaire pour calculer des statistiques à partir des dossiers
export const calculateStatistics = (dossiers: Dossier[]): Statistique => {
  return {
    totalDossiers: dossiers.length,
    dossiersCertifies: dossiers.filter(d => d.status === 'certifie').length,
    dossiersEnCours: dossiers.filter(d => d.status === 'en_cours' || d.status === 'complet').length,
    dossiersRejetes: dossiers.filter(d => d.status === 'rejete').length,
    delaiMoyenTraitement: 25, // Fixé pour la démo
  };
};
