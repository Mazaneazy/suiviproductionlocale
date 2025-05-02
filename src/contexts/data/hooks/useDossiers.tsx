
import { useState } from 'react';
import { Dossier, HistoriqueEvenement, Statistique } from '../../../types';
import { MOCK_DOSSIERS } from '../mockData';
import { generateId, calculateStatistics } from '../utils';

export function useDossiers() {
  const [dossiers, setDossiers] = useState<Dossier[]>(MOCK_DOSSIERS);
  const [statistiques, setStatistiques] = useState<Statistique>(calculateStatistics(MOCK_DOSSIERS));

  const addDossier = (dossier: Omit<Dossier, 'id'>) => {
    const newDossier = { 
      ...dossier, 
      id: generateId(),
      historique: [
        {
          id: generateId(),
          dossierId: '',  // Will be updated below
          date: new Date().toISOString(),
          action: 'Création du dossier',
          responsable: dossier.responsable || 'Système',
          commentaire: 'Dossier créé dans le système'
        }
      ] 
    };
    
    // Set the correct dossierId in the historique
    if (newDossier.historique) {
      newDossier.historique[0].dossierId = newDossier.id;
    }
    
    const updatedDossiers = [...dossiers, newDossier];
    setDossiers(updatedDossiers);
    updateStatistiques(updatedDossiers);
  };

  const updateDossier = (id: string, data: Partial<Dossier>) => {
    const dossier = dossiers.find(d => d.id === id);
    if (!dossier) return;

    // Create historique event if status changes
    if (data.status && data.status !== dossier.status) {
      const historique: HistoriqueEvenement = {
        id: generateId(),
        dossierId: id,
        date: new Date().toISOString(),
        action: `Statut modifié: ${dossier.status} → ${data.status}`,
        responsable: data.responsable || 'Système',
      };
      
      data.historique = [...(dossier.historique || []), historique];
    }
    
    const updated = dossiers.map(dossier => 
      dossier.id === id ? { ...dossier, ...data } : dossier
    );
    setDossiers(updated);
    updateStatistiques(updated);
  };

  const getDossierById = (id: string) => {
    return dossiers.find(dossier => dossier.id === id);
  };

  const updateStatistiques = (updatedDossiers: Dossier[]) => {
    setStatistiques(calculateStatistics(updatedDossiers));
  };

  return {
    dossiers,
    statistiques,
    addDossier,
    updateDossier,
    getDossierById
  };
}
