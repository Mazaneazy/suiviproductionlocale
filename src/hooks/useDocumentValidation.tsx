
import { DocumentDossier } from '@/types';

export function useDocumentValidation() {
  // Vérifier que les documents requis sont présents
  const checkRequiredDocuments = (
    dossierId: string, 
    getDocumentsByDossierId: (id: string) => DocumentDossier[]
  ) => {
    const documents = getDocumentsByDossierId(dossierId);
    
    // Liste des types de documents requis
    const requiredTypes = [
      'registre_commerce',
      'carte_contribuable',
      'processus_production',
      'liste_personnel',
      'plan_localisation'
    ];
    
    // Vérifier que chaque type de document requis est présent
    const missingDocuments = requiredTypes.filter(type => 
      !documents.some(doc => doc.type === type)
    );
    
    return {
      isComplete: missingDocuments.length === 0,
      missingDocuments
    };
  };

  // Obtenir les documents par type
  const getDocumentsByType = (
    dossierId: string, 
    documentType: string,
    getDocumentsByDossierId: (id: string) => DocumentDossier[]
  ) => {
    const documents = getDocumentsByDossierId(dossierId);
    return documents.filter(doc => doc.type === documentType);
  };

  return {
    checkRequiredDocuments,
    getDocumentsByType
  };
}
