
import { useState } from 'react';
import { Inspection, HistoriqueEvenement } from '../../../types';
import { MOCK_INSPECTIONS } from '../mockData';
import { generateId } from '../utils';

export function useInspections(updateDossier: (id: string, data: any) => void) {
  const [inspections, setInspections] = useState<Inspection[]>(MOCK_INSPECTIONS);

  const addInspection = (inspection: Omit<Inspection, 'id'>) => {
    const newInspection = { ...inspection, id: generateId() };
    setInspections([...inspections, newInspection]);
    
    // Add to dossier history
    const historique: HistoriqueEvenement = {
      id: generateId(),
      dossierId: inspection.dossierId || inspection.dossier_id,
      date: new Date().toISOString(),
      action: 'Inspection programmée',
      responsable: inspection.inspecteurs && inspection.inspecteurs[0] ? inspection.inspecteurs[0] : 'Système',
      commentaire: `Inspection programmée pour le ${new Date(inspection.dateInspection || inspection.date_inspection).toLocaleDateString()}`
    };
    
    updateDossier(inspection.dossierId || inspection.dossier_id, {
      historique: [historique] // The updateDossier function will merge with existing historique
    });
  };

  const updateInspection = (id: string, data: Partial<Inspection>) => {
    const inspection = inspections.find(i => i.id === id);
    if (!inspection) return;
    
    setInspections(inspections.map(inspection => 
      inspection.id === id ? { ...inspection, ...data } : inspection
    ));
    
    // Add to dossier history if result changes
    if (data.resultat && data.resultat !== inspection.resultat) {
      const historique: HistoriqueEvenement = {
        id: generateId(),
        dossierId: inspection.dossierId || inspection.dossier_id,
        date: new Date().toISOString(),
        action: `Résultat d'inspection: ${data.resultat}`,
        responsable: inspection.inspecteurs && inspection.inspecteurs[0] ? inspection.inspecteurs[0] : 'Inspecteur',
        commentaire: data.resultat === 'conforme' 
          ? 'Inspection validée comme conforme'
          : data.resultat === 'non_conforme'
            ? 'Inspection validée comme non conforme'
            : 'Statut d\'inspection mis à jour'
      };
      
      updateDossier(inspection.dossierId || inspection.dossier_id, {
        historique: [historique] // The updateDossier function will merge with existing historique
      });
    }
  };

  const getInspectionsByDossierId = (dossierId: string) => {
    return inspections.filter(inspection => inspection.dossierId === dossierId || inspection.dossier_id === dossierId);
  };

  return {
    inspections,
    addInspection,
    updateInspection,
    getInspectionsByDossierId
  };
}
