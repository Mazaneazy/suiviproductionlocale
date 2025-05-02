
import { Inspection, HistoriqueEvenement } from '../../../types';
import { generateId } from '../utils';

export const createInspection = (inspection: Omit<Inspection, 'id'>) => {
  return { ...inspection, id: generateId() };
};

export const createInspectionHistorique = (inspection: Inspection): HistoriqueEvenement => {
  return {
    id: generateId(),
    dossierId: inspection.dossierId,
    date: new Date().toISOString(),
    action: 'Inspection programmée',
    responsable: inspection.inspecteurs[0] || 'Système',
    commentaire: `Inspection programmée pour le ${new Date(inspection.dateInspection).toLocaleDateString()}`
  };
};

export const createInspectionResultHistorique = (
  inspection: Inspection,
  newResultat: string
): HistoriqueEvenement | undefined => {
  if (newResultat && newResultat !== inspection.resultat) {
    return {
      id: generateId(),
      dossierId: inspection.dossierId,
      date: new Date().toISOString(),
      action: `Résultat d'inspection: ${newResultat}`,
      responsable: inspection.inspecteurs[0] || 'Inspecteur',
      commentaire: newResultat === 'conforme' 
        ? 'Inspection validée comme conforme'
        : newResultat === 'non_conforme'
          ? 'Inspection validée comme non conforme'
          : 'Statut d\'inspection mis à jour'
    };
  }
  
  return undefined;
};
