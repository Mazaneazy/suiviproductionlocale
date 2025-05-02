
import { NoteFrais, HistoriqueEvenement } from '../../../types';
import { generateId } from '../utils';

export const createNoteFrais = (noteFrais: Omit<NoteFrais, 'id'>) => {
  return { ...noteFrais, id: generateId() };
};

export const createNoteFraisHistorique = (noteFrais: NoteFrais): HistoriqueEvenement => {
  return {
    id: generateId(),
    dossierId: noteFrais.dossierId,
    date: new Date().toISOString(),
    action: 'Note de frais créée',
    responsable: noteFrais.inspecteurId,
    commentaire: `Note de frais pour un montant total de ${noteFrais.total || 0} FCFA`
  };
};
