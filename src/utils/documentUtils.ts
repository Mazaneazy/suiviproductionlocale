
import { DocumentUpload } from '@/components/acceuil/DocumentsSection';

/**
 * Returns the default list of required documents for a dossier
 */
export const getDefaultDocumentsList = (): DocumentUpload[] => {
  return [
    { type: 'registre_commerce', file: null, label: 'Registre de Commerce', required: true },
    { type: 'carte_contribuable', file: null, label: 'Carte de Contribuable (NIU)', required: true },
    { type: 'processus_production', file: null, label: 'Schéma du processus de production', required: true },
    { type: 'certificats_conformite', file: null, label: 'Certificats de Conformité', required: false },
    { type: 'liste_personnel', file: null, label: 'Liste du personnel (sur papier entête)', required: true },
    { type: 'plan_localisation', file: null, label: 'Plan de localisation', required: true },
  ];
};

/**
 * Helper function to determine if a document is required
 */
export const isDocumentRequired = (documentType: string): boolean => {
  const defaultDocuments = getDefaultDocumentsList();
  const document = defaultDocuments.find(doc => doc.type === documentType);
  return document ? document.required : false;
};

/**
 * Get document label by type
 */
export const getDocumentLabel = (documentType: string): string => {
  const defaultDocuments = getDefaultDocumentsList();
  const document = defaultDocuments.find(doc => doc.type === documentType);
  return document ? document.label : documentType;
};
