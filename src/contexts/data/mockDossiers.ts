
import { Dossier } from '../../types';
import { generateId } from './utils';
import { PRODUITS_CAMEROUNAIS, OPERATEURS_CAMEROUNAIS, NOMS_CAMEROUNAIS } from './mockConstants';
import { generateRandomStatus, generateRandomDate, generateRandomDelay, generateRandomHistory } from './mockUtils';

// Fonction pour générer des dossiers à différents stades du processus
export const generateDossiers = (count = 50): Dossier[] => {
  const dossiers = [];
  
  for (let i = 0; i < count; i++) {
    const operateurIndex = i % OPERATEURS_CAMEROUNAIS.length;
    const produitIndex = i % PRODUITS_CAMEROUNAIS.length;
    const nomIndex = i % NOMS_CAMEROUNAIS.length;
    
    const status = generateRandomStatus();
    const dateTransmission = generateRandomDate();
    const delai = generateRandomDelay();
    
    const dateButoir = new Date(new Date(dateTransmission).getTime() + delai*24*60*60*1000).toISOString();
    
    const dossierId = `dossier-${i+1}`;
    const piloteTechniqueId = status !== 'en_attente' ? `tech-${Math.floor(Math.random() * 5) + 1}` : undefined;
    const piloteTechniqueNom = piloteTechniqueId ? `Pilote Tech ${Math.floor(Math.random() * 5) + 1}` : undefined;
    
    const dossier = {
      id: dossierId,
      operateurNom: OPERATEURS_CAMEROUNAIS[operateurIndex],
      promoteurNom: `${['M.', 'Mme.'][Math.floor(Math.random() * 2)]} ${NOMS_CAMEROUNAIS[nomIndex]}`,
      telephone: `6${Math.floor(Math.random() * 9) + 1}${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
      typeProduit: PRODUITS_CAMEROUNAIS[produitIndex],
      responsable: status !== 'en_attente' ? piloteTechniqueNom || 'Gestionnaire' : 'Gestionnaire',
      dateTransmission: dateTransmission,
      status: status,
      delai: delai,
      dateButoir: dateButoir,
      historique: generateRandomHistory(dossierId, status, dateTransmission, OPERATEURS_CAMEROUNAIS[operateurIndex]),
      piloteTechniqueId,
      piloteTechniqueNom
    };
    
    dossiers.push(dossier);
  }
  
  return dossiers;
};

export const MOCK_DOSSIERS = generateDossiers(50);
