
// Fonction pour récupérer la disposition du tableau de bord d'un utilisateur
export function getUserDashboardLayout(userId: string): string[] {
  try {
    const layout = localStorage.getItem(`dashboard_layout_${userId}`);
    if (layout) {
      return JSON.parse(layout);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de la disposition du tableau de bord:', error);
  }
  
  // Disposition par défaut
  return ['stats', 'dossiers', 'notifications'];
}

// Fonction pour enregistrer la disposition du tableau de bord d'un utilisateur
export function saveDashboardLayout(userId: string, layout: string[]): void {
  try {
    localStorage.setItem(`dashboard_layout_${userId}`, JSON.stringify(layout));
    console.log(`Disposition du tableau de bord enregistrée pour l'utilisateur ${userId}`);
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la disposition du tableau de bord:', error);
  }
}

// Fonction pour réinitialiser la disposition du tableau de bord d'un utilisateur
export function resetDashboardLayout(userId: string): void {
  try {
    localStorage.removeItem(`dashboard_layout_${userId}`);
    console.log(`Disposition du tableau de bord réinitialisée pour l'utilisateur ${userId}`);
  } catch (error) {
    console.error('Erreur lors de la réinitialisation de la disposition du tableau de bord:', error);
  }
}

// Fonction pour vérifier si une disposition personnalisée existe pour un utilisateur
export function hasCustomDashboardLayout(userId: string): boolean {
  try {
    const layout = localStorage.getItem(`dashboard_layout_${userId}`);
    return layout !== null;
  } catch (error) {
    console.error('Erreur lors de la vérification de la disposition du tableau de bord:', error);
    return false;
  }
}
