
import { useState } from 'react';
import { NoteFrais, HistoriqueEvenement } from '../../../types';
import { MOCK_NOTES_FRAIS } from '../mockData';
import { generateId } from '../utils';

export function useNotesFrais(updateDossier: (id: string, data: any) => void) {
  const [notesFrais, setNotesFrais] = useState<NoteFrais[]>(MOCK_NOTES_FRAIS);

  const addNoteFrais = (noteFrais: Omit<NoteFrais, 'id'>) => {
    const newNoteFrais = { ...noteFrais, id: generateId() };
    setNotesFrais([...notesFrais, newNoteFrais]);
    
    // Add to dossier history
    const historique: HistoriqueEvenement = {
      id: generateId(),
      dossierId: noteFrais.dossierId,
      date: new Date().toISOString(),
      action: 'Note de frais créée',
      responsable: noteFrais.inspecteurId,
      commentaire: `Note de frais pour un montant total de ${noteFrais.total || 0} FCFA`
    };
    
    updateDossier(noteFrais.dossierId, {
      historique: [historique] // The updateDossier function will merge with existing historique
    });
  };

  const updateNoteFrais = (id: string, data: Partial<NoteFrais>) => {
    setNotesFrais(notesFrais.map(note => 
      note.id === id ? { ...note, ...data } : note
    ));
  };

  const getNoteFraisByDossierId = (dossierId: string) => {
    return notesFrais.filter(note => note.dossierId === dossierId);
  };

  return {
    notesFrais,
    addNoteFrais,
    updateNoteFrais,
    getNoteFraisByDossierId
  };
}
