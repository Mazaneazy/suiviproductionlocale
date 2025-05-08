
import { DocumentDossier } from '@/types';

/**
 * Hook providing document validation functionality
 */
export function useDocumentValidation() {
  /**
   * Vérifie si les documents requis sont présents et valides
   */
  const checkRequiredDocuments = (
    dossierId: string,
    getDocumentsByDossierId: (id: string) => DocumentDossier[]
  ): { isComplete: boolean, missingTypes: string[] } => {
    const requiredTypes = [
      'registre_commerce',
      'carte_contribuable',
      'processus_production',
      'liste_personnel',
      'plan_localisation'
    ];
    
    const dossierDocuments = getDocumentsByDossierId(dossierId);
    const validDocuments = dossierDocuments.filter(doc => doc.status === 'valide');
    
    const presentTypes = validDocuments.map(doc => doc.type);
    const missingTypes = requiredTypes.filter(type => !presentTypes.includes(type));
    
    return {
      isComplete: missingTypes.length === 0,
      missingTypes
    };
  };

  /**
   * Récupère tous les documents pour un type spécifique dans un dossier
   */
  const getDocumentsByType = (
    dossierId: string,
    documentType: string,
    getDocumentsByDossierId: (id: string) => DocumentDossier[]
  ): DocumentDossier[] => {
    const dossierDocuments = getDocumentsByDossierId(dossierId);
    return dossierDocuments.filter(doc => doc.type === documentType);
  };
  
  return { checkRequiredDocuments, getDocumentsByType };
}
