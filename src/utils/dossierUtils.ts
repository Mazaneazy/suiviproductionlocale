
// Fonction pour récupérer le dernier ID de dossier créé
export const getLatestDossierId = (): string | undefined => {
  try {
    const storedDossiers = localStorage.getItem('dossiers');
    if (storedDossiers) {
      const dossiers = JSON.parse(storedDossiers);
      if (dossiers.length > 0) {
        return dossiers[dossiers.length - 1].id;
      }
    }
    return undefined;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'ID du dernier dossier:", error);
    return undefined;
  }
};

// Vérifier si un nom d'entreprise existe déjà
export const doesCompanyNameExist = (name: string): boolean => {
  try {
    const storedDossiers = localStorage.getItem('dossiers');
    if (storedDossiers) {
      const dossiers = JSON.parse(storedDossiers);
      return dossiers.some((dossier: any) => 
        dossier.operateurNom.toLowerCase() === name.toLowerCase()
      );
    }
    return false;
  } catch (error) {
    console.error("Erreur lors de la vérification du nom d'entreprise:", error);
    return false;
  }
};

// Fonction pour générer une référence de dossier unique
export const generateDossierReference = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  
  return `CERT-${year}${month}-${random}`;
};
