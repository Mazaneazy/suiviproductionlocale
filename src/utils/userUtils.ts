
// Utility functions for user-related operations
export const getRoleLabel = (role: string): string => {
  const roleLabels = getRoleLabels();
  return roleLabels[role] || role;
};

export const getRoleLabels = (): Record<string, string> => {
  return {
    'admin': 'Administrateur',
    'acceuil': 'Poste d\'Accueil',
    'inspecteur': 'Chef des Inspections',
    'analyste': 'Chargé du reporting',
    'surveillant': 'Agent de surveillance',
    'comptable': 'Responsable Notes de Frais',
    'directeur': 'Directeur Evaluation Conformité',
    'responsable_technique': 'Responsable Technique',
    'chef_mission': 'Chef de Mission d\'Inspection',
    'certificats': 'Délivrance des Certificats',
    'directeur_general': 'Directeur Général ANOR',
    'gestionnaire': 'Gestionnaire des Dossiers',
    'producteur': 'Producteur Local'
  };
};

// Format date to localized string
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Calculate action statistics
export const calculateActionStats = (actions: any[]) => {
  return {
    total: actions.length,
    today: actions.filter(a => {
      const today = new Date();
      const actionDate = new Date(a.date);
      return actionDate.toDateString() === today.toDateString();
    }).length,
    lastWeek: actions.filter(a => {
      const today = new Date();
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const actionDate = new Date(a.date);
      return actionDate >= lastWeek;
    }).length,
    byModule: actions.reduce<Record<string, number>>((acc, action) => {
      acc[action.module] = (acc[action.module] || 0) + 1;
      return acc;
    }, {}),
    byType: actions.reduce<Record<string, number>>((acc, action) => {
      acc[action.action] = (acc[action.action] || 0) + 1;
      return acc;
    }, {})
  };
};
