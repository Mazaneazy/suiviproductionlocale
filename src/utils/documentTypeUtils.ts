
/**
 * Determines the type of document based on the filename
 * 
 * @param fileName The name of the document file
 * @returns The determined document type as a string
 */
export const determineDocumentType = (fileName: string): string => {
  const lowerFileName = fileName.toLowerCase();
  
  if (lowerFileName.includes('registre') || lowerFileName.includes('rccm')) {
    return 'registre_commerce';
  } else if (lowerFileName.includes('contribuable') || lowerFileName.includes('niu')) {
    return 'carte_contribuable';
  } else if (lowerFileName.includes('processus') || lowerFileName.includes('production')) {
    return 'processus_production';
  } else if (lowerFileName.includes('personnel') || lowerFileName.includes('liste')) {
    return 'liste_personnel';
  } else if (lowerFileName.includes('plan') || lowerFileName.includes('localisation')) {
    return 'plan_localisation';
  } else if (lowerFileName.includes('certificat') || lowerFileName.includes('conform')) {
    return 'certificats_conformite';
  } else if (lowerFileName.includes('rapport') || lowerFileName.includes('inspect')) {
    return 'rapport_inspection';
  } else if (lowerFileName.includes('analyse') || lowerFileName.includes('labo')) {
    return 'rapport_analyse';
  } else if (lowerFileName.includes('avis') || lowerFileName.includes('technique')) {
    return 'avis_technique';
  }
  
  return 'pdf'; // Type par défaut
};

/**
 * Format document type to a user-friendly label
 * 
 * @param type The document type to format
 * @returns A user-friendly string representation of the document type
 */
export const formatDocumentType = (type: string): string => {
  switch (type) {
    case 'registre_commerce':
      return 'Registre de Commerce';
    case 'carte_contribuable':
      return 'Carte de Contribuable';
    case 'processus_production':
      return 'Processus de production';
    case 'certificats_conformite':
      return 'Certificats';
    case 'liste_personnel':
      return 'Liste du personnel';
    case 'plan_localisation':
      return 'Plan de localisation';
    case 'pdf':
    default:
      return 'Autres documents';
  }
};
