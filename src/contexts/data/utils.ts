
import { Dossier, Statistique, UserRole } from '../../types';

// Fonction utilitaire pour générer des identifiants aléatoires
export const generateId = (): string => Math.random().toString(36).substring(2, 11);

// Fonction utilitaire pour calculer des statistiques à partir des dossiers
export const calculateStatistics = (dossiers: Dossier[], userRole?: UserRole): Statistique => {
  // Statistiques de base pour tous les rôles
  const stats = {
    totalDossiers: dossiers.length,
    dossiersCertifies: dossiers.filter(d => d.status === 'certifie').length,
    dossiersEnCours: dossiers.filter(d => d.status === 'en_cours' || d.status === 'complet').length,
    dossiersRejetes: dossiers.filter(d => d.status === 'rejete').length,
    delaiMoyenTraitement: 25, // Fixé pour la démo
  };

  // Statistiques supplémentaires spécifiques au rôle
  switch (userRole) {
    case 'directeur':
      // Le directeur peut voir toutes les statistiques
      return stats;
    case 'acceuil':
      // L'accueil ne voit que les dossiers en cours et le total
      return {
        ...stats,
        dossiersCertifies: 0, // Caché pour ce rôle
        dossiersRejetes: 0, // Caché pour ce rôle
      };
    case 'analyste':
      // L'analyste voit les dossiers en cours et certifiés
      return {
        ...stats,
        dossiersRejetes: 0, // Caché pour ce rôle
      };
    default:
      return stats;
  }
};
