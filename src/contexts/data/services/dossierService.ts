
import { Dossier, HistoriqueEvenement, Notification } from '../../../types';
import { generateId } from '../utils';

export const createDossier = (
  dossier: Partial<Dossier>,
  addNotification: (notification: Omit<Notification, 'id'>) => void
) => {
  // Extract documents if they exist in the dossier object
  const dossierId = dossier.id || generateId();
  let dossiersDocuments = [];
  
  if ('documents' in dossier && Array.isArray(dossier.documents)) {
    dossiersDocuments = dossier.documents;
    // Remove documents from the dossier object to avoid duplication
    const { documents: _, ...dossierWithoutDocuments } = dossier;
    dossier = dossierWithoutDocuments;
  }

  const newDossier = { 
    ...dossier,
    id: dossierId,
    historique: [
      {
        id: generateId(),
        dossierId: dossierId,
        date: new Date().toISOString(),
        action: 'Création du dossier',
        responsable: dossier.responsable || 'Système',
        commentaire: 'Dossier créé dans le système'
      }
    ] 
  } as Dossier;
  
  // Create a notification for the Responsable Technique
  addNotification({
    message: `Nouveau dossier pour ${dossier.operateurNom} reçu`,
    date: new Date().toISOString(),
    lue: false,
    type: 'info',
    link: '/responsable-technique'
  });
  
  return { newDossier, dossiersDocuments };
};

export const updateDossierStatus = (
  dossier: Dossier,
  newStatus: string,
  responsable?: string
): HistoriqueEvenement | undefined => {
  if (newStatus && newStatus !== dossier.status) {
    return {
      id: generateId(),
      dossierId: dossier.id,
      date: new Date().toISOString(),
      action: `Statut modifié: ${dossier.status} → ${newStatus}`,
      responsable: responsable || 'Système',
    };
  }
  
  return undefined;
};
