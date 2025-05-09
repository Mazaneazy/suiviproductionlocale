
import { Inspection } from '../../types';
import { MOCK_DOSSIERS } from './mockDossiers';
import { NOMS_CAMEROUNAIS } from './mockConstants';

// Générer des inspections pour certains dossiers
export const MOCK_INSPECTIONS: Inspection[] = MOCK_DOSSIERS
  .filter(dossier => ['complet', 'rejete', 'certifie'].includes(dossier.status))
  .slice(0, 25)
  .map((dossier, index) => ({
    id: `inspection-${index+1}`,
    dossierId: dossier.id,
    dateInspection: new Date(new Date(dossier.dateTransmission).getTime() + 15*24*60*60*1000).toISOString(),
    lieu: `Site de production - ${dossier.operateurNom}`,
    inspecteurs: [
      `Insp. ${NOMS_CAMEROUNAIS[index % NOMS_CAMEROUNAIS.length]}`,
      `Insp. ${NOMS_CAMEROUNAIS[(index + 10) % NOMS_CAMEROUNAIS.length]}`
    ],
    resultat: dossier.status === 'rejete' ? 'non_conforme' : (dossier.status === 'certifie' ? 'conforme' : 'en_attente'),
    notes: `Inspection réalisée pour évaluer la conformité du produit ${dossier.typeProduit}`,
    recommandations: dossier.status === 'rejete' ? 'Révision complète du processus de production nécessaire' : 'Maintenir le niveau de qualité actuel',
    actionsCorrectives: dossier.status === 'rejete' ? 'Mise à jour des installations et formation du personnel' : undefined,
    planInspection: Math.random() > 0.7 ? 'https://example.com/docs/plan_inspection.pdf' : undefined,
    planEchantillonage: Math.random() > 0.7 ? 'https://example.com/docs/plan_echantillonnage.pdf' : undefined,
    checklistComplete: Math.random() > 0.3
  }));
