
/**
 * Récupère l'ID du dernier dossier créé depuis localStorage
 * 
 * @returns The ID of the latest dossier or null if none is found
 */
export const getLatestDossierId = (): string | null => {
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
