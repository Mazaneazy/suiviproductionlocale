
import { DocumentDossier, HistoriqueEvenement } from '../../../types';
import { generateId } from '../utils';

export const createDocument = (document: Omit<DocumentDossier, 'id'>) => {
  return { 
    ...document, 
    id: generateId(), 
    status: 'en_attente' as 'valide' | 'rejete' | 'en_attente'
  };
};

export const createDocumentHistorique = (document: DocumentDossier): HistoriqueEvenement => {
  return {
    id: generateId(),
    dossierId: document.dossierId,
    date: new Date().toISOString(),
    action: 'Document ajouté',
    responsable: 'Utilisateur',
    commentaire: `Document "${document.nom}" ajouté au dossier`
  };
};

export const createDocumentRemovalHistorique = (document: DocumentDossier): HistoriqueEvenement => {
  return {
    id: generateId(),
    dossierId: document.dossierId,
    date: new Date().toISOString(),
    action: 'Document supprimé',
    responsable: 'Utilisateur',
    commentaire: `Document "${document.nom}" supprimé du dossier`
  };
};

export const createDocumentStatusHistorique = (
  document: DocumentDossier,
  newStatus: string
): HistoriqueEvenement | undefined => {
  if (newStatus && newStatus !== document.status) {
    return {
      id: generateId(),
      dossierId: document.dossierId,
      date: new Date().toISOString(),
      action: `Statut du document modifié: ${document.status || 'non défini'} → ${newStatus}`,
      responsable: 'Utilisateur',
      commentaire: `Statut du document "${document.nom}" modifié`
    };
  }
  
  return undefined;
};
