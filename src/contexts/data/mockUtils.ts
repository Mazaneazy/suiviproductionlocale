
import { generateId } from './utils';

// Générer un statut aléatoire avec une pondération pour avoir différentes proportions
export const generateRandomStatus = () => {
  const rand = Math.random();
  if (rand < 0.25) return 'en_attente';
  if (rand < 0.45) return 'en_cours';
  if (rand < 0.60) return 'complet';
  if (rand < 0.75) return 'rejete';
  if (rand < 0.90) return 'certifie';
  return 'a_corriger';
};

// Générer une date aléatoire dans les derniers 6 mois
export const generateRandomDate = (monthsBack = 6) => {
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setMonth(pastDate.getMonth() - Math.floor(Math.random() * monthsBack));
  pastDate.setDate(Math.floor(Math.random() * 28) + 1); // Éviter les problèmes de dates de fin de mois
  return pastDate.toISOString();
};

// Générer un délai aléatoire entre 15 et 90 jours
export const generateRandomDelay = () => {
  return Math.floor(Math.random() * 76) + 15;
};

// Générer un historique d'événements aléatoire pour un dossier
export const generateRandomHistory = (dossierId: string, status: string, dateTransmission: string, operateurNom: string) => {
  const history = [
    {
      id: generateId(),
      dossierId,
      date: dateTransmission,
      action: 'Création du dossier',
      responsable: 'Chargé de clientèle',
      commentaire: `Dossier créé pour ${operateurNom}`
    }
  ];

  // Ajouter des événements en fonction du statut
  if (status !== 'en_attente') {
    history.push({
      id: generateId(),
      dossierId,
      date: new Date(new Date(dateTransmission).getTime() + 3*24*60*60*1000).toISOString(),
      action: 'Assignation du pilote technique',
      responsable: 'Gestionnaire',
      commentaire: 'Pilote technique assigné au dossier'
    });
  }

  if (['complet', 'rejete', 'certifie'].includes(status)) {
    history.push({
      id: generateId(),
      dossierId,
      date: new Date(new Date(dateTransmission).getTime() + 10*24*60*60*1000).toISOString(),
      action: 'Programmation inspection',
      responsable: 'Responsable des missions',
      commentaire: 'Inspection programmée sur site'
    });
    
    history.push({
      id: generateId(),
      dossierId,
      date: new Date(new Date(dateTransmission).getTime() + 15*24*60*60*1000).toISOString(),
      action: 'Rapport inspection',
      responsable: 'Inspecteur',
      commentaire: 'Rapport d\'inspection soumis'
    });
  }

  if (['certifie', 'rejete'].includes(status)) {
    history.push({
      id: generateId(),
      dossierId,
      date: new Date(new Date(dateTransmission).getTime() + 20*24*60*60*1000).toISOString(),
      action: 'Avis décision',
      responsable: 'Pilote technique',
      commentaire: status === 'certifie' ? 'Avis favorable émis' : 'Avis défavorable émis'
    });
    
    history.push({
      id: generateId(),
      dossierId,
      date: new Date(new Date(dateTransmission).getTime() + 25*24*60*60*1000).toISOString(),
      action: 'Validation comité',
      responsable: 'Comité de validation',
      commentaire: status === 'certifie' ? 'Dossier validé pour certification' : 'Dossier rejeté'
    });
  }

  if (status === 'certifie') {
    history.push({
      id: generateId(),
      dossierId,
      date: new Date(new Date(dateTransmission).getTime() + 28*24*60*60*1000).toISOString(),
      action: 'Certificat émis',
      responsable: 'Responsable qualité',
      commentaire: 'Certificat de conformité émis'
    });
  }

  return history;
};
