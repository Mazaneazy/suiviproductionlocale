
import { getDocumentLabel } from './documentUtils';

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
