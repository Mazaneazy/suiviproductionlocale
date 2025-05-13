
export const formatDocumentType = (type: string): string => {
  switch (type) {
    case 'registre_commerce':
      return 'Registre de Commerce';
    case 'carte_contribuable':
      return 'Carte de Contribuable (NIU)';
    case 'processus_production':
      return 'Schéma du processus de production';
    case 'certificats_conformite':
      return 'Certificats de Conformité';
    case 'liste_personnel':
      return 'Liste du personnel';
    case 'plan_localisation':
      return 'Plan de localisation';
    case 'pdf':
      return 'Document PDF';
    default:
      return type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ');
  }
};

export const determineDocumentType = (fileName: string): string => {
  fileName = fileName.toLowerCase();
  
  if (fileName.includes('rccm') || fileName.includes('registre') || fileName.includes('commerce')) {
    return 'registre_commerce';
  }
  
  if (fileName.includes('niu') || fileName.includes('contribuable')) {
    return 'carte_contribuable';
  }
  
  if (fileName.includes('process') || fileName.includes('fabrication') || fileName.includes('production')) {
    return 'processus_production';
  }
  
  if (fileName.includes('conform') || fileName.includes('matiere') || fileName.includes('primaire')) {
    return 'certificats_conformite';
  }
  
  if (fileName.includes('personnel') || fileName.includes('staff')) {
    return 'liste_personnel';
  }
  
  if (fileName.includes('produits') || fileName.includes('products') || fileName.includes('certifier')) {
    return 'plan_localisation';
  }
  
  // Par défaut, retourner 'pdf' comme type générique
  return 'pdf';
};
