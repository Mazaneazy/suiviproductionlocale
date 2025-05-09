
import { Dossier, NoteFrais, Inspection, Certificat, Notification, DocumentDossier } from '../../types';
import { generateId } from './utils';

// Produits locaux camerounais pour échantillonnage diversifié
const PRODUITS_CAMEROUNAIS = [
  "Huile de palme rouge", "Miel de la région de l'Ouest", "Café Arabica", "Cacao en poudre", 
  "Chocolat artisanal", "Poivre blanc de Penja", "Ananas de Bafia", "Mangues de l'Adamaoua", 
  "Macabo séché", "Arachides grillées", "Piment de Bokito", "Gingembre de Bangangté",
  "Safou (prune africaine)", "Riz de Ndop", "Maïs transformé", "Manioc transformé",
  "Tomate séchée", "Banane plantain chips", "Moringa en poudre", "Avocat séché",
  "Yaourt à base de soja", "Beurre de karité", "Thé des hauts plateaux", "Vin de palme pasteurisé",
  "Jus de bissap (hibiscus)", "Gari (semoule de manioc)", "Tapioca", "Saucisse de soja",
  "Poudre de baobab", "Noix de cola conditionnée", "Confiture de papaye", "Huile de sésame",
  "Savon noir traditionnel", "Sel gemme de Bibémi", "Farine de maïs", "Farine de manioc",
  "Spiruline du lac Tchad", "Pulpe de ndjansang", "Bâtons de manioc", "Igname séché"
];

// Noms d'entreprises camerounaises pour échantillonnage diversifié
const OPERATEURS_CAMEROUNAIS = [
  "SABC", "SOSUCAM", "CHOCOCAM", "CICAM", "SADEM", "FERMENCAM", "AGROCAM", "CAMLAIT",
  "CINPHARM", "NABCO", "SOACAM", "SAFACAM", "SOCAPALM", "TROPICAM", "NUTRICAM", "BIOPHARMA",
  "FERMENCAM", "AGRO-PME", "FIMEX", "CODILAIT", "SEPROCA", "SOTRACODIM", "BRASSERIES DU CAMEROUN", 
  "SPC", "SOCATRAL", "SOCOFER", "CAPLAIT", "COSMIVOIRE", "PROMETAL", "ACROM",
  "SOREPCO", "ENEO", "HYDRAC", "SOFAVINC", "LA PASTA", "SITRACEL", "SCTB", "SOCAVER",
  "PLASTICAM", "SITABAC", "CAMLAIT", "SOCAPURCEL", "AZUR", "MIDA", "CIMENCAM", "BOCOM",
  "FOKOU", "SEMME", "AZUR", "PIONNIER"
];

// Noms camerounais pour échantillonnage diversifié
const NOMS_CAMEROUNAIS = [
  "Mbarga", "Nkeng", "Tchuente", "Nganou", "Beyala", "Atangana", "Ebongue", "Ngo Tjomb", 
  "Mpoudi", "Oumarou", "Hamidou", "Fochive", "Djoumessi", "Nseke", "Touani", "Dongmo",
  "Kamga", "Nkodo", "Tabi", "Essomba", "Njock", "Eto'o", "Mbappé", "Mvondo",
  "Ngono", "Edoa", "Kouokam", "Ndongo", "Tchaptchet", "Etoundi", "Meka", "Onana",
  "Mbassi", "Fotso", "Talla", "Nana", "Nsom", "Ashu", "Fouda", "Nga",
  "Abega", "Temgoua", "Minyem", "Ngando", "Nkemleke", "Kwedi", "Wanko", "Nguini",
  "Elimbi", "Nlend", "Ngono", "Owona", "Ndzana", "Mbella", "Ekani", "Moussa",
  "Malolo", "Ndoumbe", "Eloundou", "Nomo", "Biya", "Tchatchoua", "Youmbi", "Ekambi"
];

// Générer un statut aléatoire avec une pondération pour avoir différentes proportions
const generateRandomStatus = () => {
  const rand = Math.random();
  if (rand < 0.25) return 'en_attente';
  if (rand < 0.45) return 'en_cours';
  if (rand < 0.60) return 'complet';
  if (rand < 0.75) return 'rejete';
  if (rand < 0.90) return 'certifie';
  return 'a_corriger';
};

// Générer une date aléatoire dans les derniers 6 mois
const generateRandomDate = (monthsBack = 6) => {
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setMonth(pastDate.getMonth() - Math.floor(Math.random() * monthsBack));
  pastDate.setDate(Math.floor(Math.random() * 28) + 1); // Éviter les problèmes de dates de fin de mois
  return pastDate.toISOString();
};

// Générer un délai aléatoire entre 15 et 90 jours
const generateRandomDelay = () => {
  return Math.floor(Math.random() * 76) + 15;
};

// Générer un historique d'événements aléatoire pour un dossier
const generateRandomHistory = (dossierId, status, dateTransmission, operateurNom) => {
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

// Fonction pour générer 50 dossiers à différents stades du processus
const generateDossiers = (count = 50) => {
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

// Générer 50 dossiers
export const MOCK_DOSSIERS: Dossier[] = generateDossiers(50);

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
    acquitte: Math.random() > 0.5
  }));

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

// Générer des certificats pour les dossiers certifiés
export const MOCK_CERTIFICATS: Certificat[] = MOCK_DOSSIERS
  .filter(dossier => dossier.status === 'certifie')
  .map((dossier, index) => {
    const dateDelivrance = new Date(new Date(dossier.dateTransmission).getTime() + 30*24*60*60*1000).toISOString();
    const dateExpiration = new Date(new Date(dateDelivrance).getTime() + 365*24*60*60*1000).toISOString();
    
    return {
      id: `certificat-${index+1}`,
      dossierId: dossier.id,
      numero: `CERT-${new Date().getFullYear()}-${(index+1).toString().padStart(3, '0')}`,
      dateDelivrance,
      dateExpiration,
      entreprise: dossier.operateurNom,
      produit: dossier.typeProduit,
      status: 'actif',
      responsableQualiteId: `resp-qual-${index % 3 + 1}`,
      resultatConformite: {
        id: `res-conf-${index+1}`,
        certificatId: `certificat-${index+1}`,
        dateEvaluation: new Date(new Date(dossier.dateTransmission).getTime() + 25*24*60*60*1000).toISOString(),
        conclusion: `Le produit ${dossier.typeProduit} est conforme aux normes camerounaises applicables.`,
        rapport: `Rapport d'évaluation de conformité - ${dossier.operateurNom}`
      }
    };
  });

// Générer des notifications
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: generateId(),
    message: 'Nouveau dossier en attente de validation.',
    date: new Date().toISOString(),
    lue: false,
    type: 'info',
  },
  {
    id: generateId(),
    message: 'Votre note de frais a été approuvée.',
    date: new Date().toISOString(),
    lue: false,
    type: 'info',
  },
  {
    id: generateId(),
    message: 'La date d\'expiration de votre certificat approche.',
    date: new Date().toISOString(),
    lue: false,
    type: 'warning',
  },
];

// Générer des documents pour les dossiers
export const MOCK_DOCUMENTS: DocumentDossier[] = [];

// Ajouter des documents pour chaque dossier
MOCK_DOSSIERS.forEach(dossier => {
  // Document de base pour tous les dossiers
  MOCK_DOCUMENTS.push({
    id: `doc-rc-${dossier.id}`,
    dossierId: dossier.id,
    nom: 'Registre de Commerce',
    type: 'registre_commerce',
    url: 'https://example.com/docs/registre_commerce.pdf',
    dateUpload: new Date(dossier.dateTransmission).toISOString(),
    status: Math.random() > 0.3 ? 'valide' : 'en_attente'
  });
  
  MOCK_DOCUMENTS.push({
    id: `doc-cc-${dossier.id}`,
    dossierId: dossier.id,
    nom: 'Carte de Contribuable',
    type: 'carte_contribuable',
    url: 'https://example.com/docs/carte_contribuable.pdf',
    dateUpload: new Date(dossier.dateTransmission).toISOString(),
    status: Math.random() > 0.3 ? 'valide' : 'en_attente'
  });
  
  // Documents supplémentaires pour les dossiers plus avancés
  if (['complet', 'rejete', 'certifie'].includes(dossier.status)) {
    MOCK_DOCUMENTS.push({
      id: `doc-pp-${dossier.id}`,
      dossierId: dossier.id,
      nom: 'Schéma du processus de production',
      type: 'processus_production',
      url: 'https://example.com/docs/processus.pdf',
      dateUpload: new Date(new Date(dossier.dateTransmission).getTime() + 5*24*60*60*1000).toISOString(),
      status: Math.random() > 0.2 ? 'valide' : 'en_attente'
    });
    
    MOCK_DOCUMENTS.push({
      id: `doc-pl-${dossier.id}`,
      dossierId: dossier.id,
      nom: 'Plan de localisation',
      type: 'plan_localisation',
      url: 'https://example.com/docs/plan.pdf',
      dateUpload: new Date(new Date(dossier.dateTransmission).getTime() + 5*24*60*60*1000).toISOString(),
      status: Math.random() > 0.2 ? 'valide' : 'en_attente'
    });
    
    // Rapports d'inspection pour les dossiers avec inspection
    if (dossier.status === 'certifie' || dossier.status === 'rejete') {
      MOCK_DOCUMENTS.push({
        id: `doc-ri-${dossier.id}`,
        dossierId: dossier.id,
        nom: 'Rapport d\'inspection',
        type: 'rapport_inspection',
        url: 'https://example.com/docs/rapport_inspection.pdf',
        dateUpload: new Date(new Date(dossier.dateTransmission).getTime() + 15*24*60*60*1000).toISOString(),
        status: 'valide'
      });
      
      MOCK_DOCUMENTS.push({
        id: `doc-ra-${dossier.id}`,
        dossierId: dossier.id,
        nom: 'Rapport d\'analyse',
        type: 'rapport_analyse',
        url: 'https://example.com/docs/rapport_analyse.pdf',
        dateUpload: new Date(new Date(dossier.dateTransmission).getTime() + 18*24*60*60*1000).toISOString(),
        status: 'valide'
      });
      
      // Avis de décision pour les dossiers certifiés ou rejetés
      MOCK_DOCUMENTS.push({
        id: `doc-ad-${dossier.id}`,
        dossierId: dossier.id,
        nom: 'Avis de décision',
        type: 'avis_decision',
        url: 'https://example.com/docs/avis_decision.pdf',
        dateUpload: new Date(new Date(dossier.dateTransmission).getTime() + 22*24*60*60*1000).toISOString(),
        status: 'valide'
      });
      
      // PV comité validation pour les dossiers certifiés ou rejetés
      MOCK_DOCUMENTS.push({
        id: `doc-pv-${dossier.id}`,
        dossierId: dossier.id,
        nom: 'Procès verbal du comité',
        type: 'proces_verbal',
        url: 'https://example.com/docs/pv_comite.pdf',
        dateUpload: new Date(new Date(dossier.dateTransmission).getTime() + 25*24*60*60*1000).toISOString(),
        status: 'valide'
      });
    }
    
    // Certificat pour les dossiers certifiés
    if (dossier.status === 'certifie') {
      MOCK_DOCUMENTS.push({
        id: `doc-cert-${dossier.id}`,
        dossierId: dossier.id,
        nom: 'Certificat de conformité',
        type: 'certificat',
        url: 'https://example.com/docs/certificat.pdf',
        dateUpload: new Date(new Date(dossier.dateTransmission).getTime() + 30*24*60*60*1000).toISOString(),
        status: 'valide'
      });
    }
  }
});

