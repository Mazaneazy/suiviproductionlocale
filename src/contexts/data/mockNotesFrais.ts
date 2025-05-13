
import { NoteFrais } from '../../types';
import { MOCK_DOSSIERS } from './mockDossiers';

// Générer des notes de frais pour certains dossiers
export const MOCK_NOTES_FRAIS: NoteFrais[] = MOCK_DOSSIERS
  .filter(dossier => ['complet', 'rejete', 'certifie'].includes(dossier.status))
  .slice(0, 20)
  .map((dossier, index) => ({
    id: `note-${index+1}`,
    dossierId: dossier.id,
    inspecteurId: `insp-00${index % 5 + 1}`,
    date: new Date(new Date(dossier.dateTransmission).getTime() + 12*24*60*60*1000).toISOString(),
    dateCreation: new Date(new Date(dossier.dateTransmission).getTime() + 12*24*60*60*1000).toISOString(),
    description: `Frais d'évaluation - ${dossier.operateurNom} - ${dossier.typeProduit}`,
    montant: Math.floor(Math.random() * 50000) + 30000,
    status: Math.random() > 0.3 ? 'valide' : 'en_attente',
    fraisGestion: Math.floor(Math.random() * 10000) + 5000,
    fraisInspection: Math.floor(Math.random() * 15000) + 10000,
    fraisAnalyses: Math.floor(Math.random() * 15000) + 10000,
    fraisSurveillance: Math.floor(Math.random() * 10000) + 5000,
    acquitte: Math.random() > 0.5,
    notificationEnvoyee: Math.random() > 0.5,
    operateurNotifie: Math.random() > 0.7
  }));
