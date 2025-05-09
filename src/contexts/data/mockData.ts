
import { Dossier, NoteFrais, Inspection, Certificat, Notification, DocumentDossier } from '../../types';
import { generateId } from './utils';

export const MOCK_DOSSIERS: Dossier[] = [
  {
    id: 'dossier-1',
    operateurNom: 'SADAM Sarl',
    promoteurNom: 'M. Jean Eboa',
    telephone: '678901234',
    typeProduit: 'Jus de fruits',
    responsable: 'Gestionnaire',
    dateTransmission: new Date(2024, 0, 20).toISOString(),
    status: 'en_attente',
    delai: 30,
    dateButoir: new Date(2024, 1, 19).toISOString(),
    historique: [
      {
        id: generateId(),
        dossierId: 'dossier-1',
        date: new Date().toISOString(),
        action: 'Dossier créé',
        responsable: 'System',
        commentaire: 'Dossier initial créé par le système.'
      }
    ]
  },
  {
    id: 'dossier-2',
    operateurNom: 'BOIS Sarl',
    promoteurNom: 'Mme. Alice Kamga',
    telephone: '698765432',
    typeProduit: 'Eau minérale',
    responsable: 'Gestionnaire',
    dateTransmission: new Date(2024, 0, 15).toISOString(),
    status: 'complet',
    delai: 45,
    dateButoir: new Date(2024, 2, 1).toISOString(),
    historique: [
      {
        id: generateId(),
        dossierId: 'dossier-2',
        date: new Date().toISOString(),
        action: 'Dossier créé',
        responsable: 'System',
        commentaire: 'Dossier initial créé par le système.'
      }
    ]
  },
  {
    id: 'dossier-3',
    operateurNom: 'CATTIN Cameroon',
    promoteurNom: 'M. Pierre Titi',
    telephone: '654321098',
    typeProduit: 'Conserves de légumes',
    responsable: 'Gestionnaire',
    dateTransmission: new Date(2024, 0, 10).toISOString(),
    status: 'rejete',
    delai: 60,
    dateButoir: new Date(2024, 2, 10).toISOString(),
    historique: [
      {
        id: generateId(),
        dossierId: 'dossier-3',
        date: new Date().toISOString(),
        action: 'Dossier créé',
        responsable: 'System',
        commentaire: 'Dossier initial créé par le système.'
      }
    ]
  },
  {
    id: 'dossier-4',
    operateurNom: 'AFRICA FOODS',
    promoteurNom: 'Mme. Marie Ntonè',
    telephone: '666777888',
    typeProduit: 'Biscuits',
    responsable: 'Gestionnaire',
    dateTransmission: new Date(2024, 0, 5).toISOString(),
    status: 'en_attente',
    delai: 30,
    dateButoir: new Date(2024, 1, 4).toISOString(),
    historique: [
      {
        id: generateId(),
        dossierId: 'dossier-4',
        date: new Date().toISOString(),
        action: 'Dossier créé',
        responsable: 'System',
        commentaire: 'Dossier initial créé par le système.'
      }
    ]
  },
  {
    id: 'dossier-5',
    operateurNom: 'AGROCAM Sarl',
    promoteurNom: 'M. Marc Essomba',
    telephone: '688999000',
    typeProduit: 'Huile végétale',
    responsable: 'Gestionnaire',
    dateTransmission: new Date(2023, 11, 28).toISOString(),
    status: 'en_attente',
    delai: 45,
    dateButoir: new Date(2024, 1, 11).toISOString(),
    historique: [
      {
        id: generateId(),
        dossierId: 'dossier-5',
        date: new Date().toISOString(),
        action: 'Dossier créé',
        responsable: 'System',
        commentaire: 'Dossier initial créé par le système.'
      }
    ]
  },
  {
    id: 'dossier-6',
    operateurNom: 'SODECAO SA',
    promoteurNom: 'Mme. Jeanne Biloa',
    telephone: '677112233',
    typeProduit: 'Chocolat',
    responsable: 'Gestionnaire',
    dateTransmission: new Date(2023, 11, 20).toISOString(),
    status: 'en_attente',
    delai: 60,
    dateButoir: new Date(2024, 1, 19).toISOString(),
    historique: [
      {
        id: generateId(),
        dossierId: 'dossier-6',
        date: new Date().toISOString(),
        action: 'Dossier créé',
        responsable: 'System',
        commentaire: 'Dossier initial créé par le système.'
      }
    ]
  },
  {
    id: 'dossier-7',
    operateurNom: 'SAFACAM SA',
    promoteurNom: 'M. Alain Tewa',
    telephone: '699887766',
    typeProduit: 'Farine de blé',
    responsable: 'Gestionnaire',
    dateTransmission: new Date(2023, 11, 12).toISOString(),
    status: 'en_attente',
    delai: 30,
    dateButoir: new Date(2024, 0, 11).toISOString(),
    historique: [
      {
        id: generateId(),
        dossierId: 'dossier-7',
        date: new Date().toISOString(),
        action: 'Dossier créé',
        responsable: 'System',
        commentaire: 'Dossier initial créé par le système.'
      }
    ]
  },
  {
    id: 'dossier-8',
    operateurNom: 'CAMLAIT SA',
    promoteurNom: 'Mme. Isabelle Mbassi',
    telephone: '655443322',
    typeProduit: 'Lait pasteurisé',
    responsable: 'Gestionnaire',
    dateTransmission: new Date(2023, 11, 5).toISOString(),
    status: 'en_attente',
    delai: 45,
    dateButoir: new Date(2024, 0, 19).toISOString(),
    historique: [
      {
        id: generateId(),
        dossierId: 'dossier-8',
        date: new Date().toISOString(),
        action: 'Dossier créé',
        responsable: 'System',
        commentaire: 'Dossier initial créé par le système.'
      }
    ]
  },
  {
    id: 'dossier-9',
    operateurNom: 'BRASSERIES DU CAMEROUN',
    promoteurNom: 'M. Joseph Ndongo',
    telephone: '677665544',
    typeProduit: 'Boissons gazeuses',
    responsable: 'Gestionnaire',
    dateTransmission: new Date(2023, 10, 28).toISOString(),
    status: 'en_attente',
    delai: 60,
    dateButoir: new Date(2024, 0, 27).toISOString(),
    historique: [
      {
        id: generateId(),
        dossierId: 'dossier-9',
        date: new Date().toISOString(),
        action: 'Dossier créé',
        responsable: 'System',
        commentaire: 'Dossier initial créé par le système.'
      }
    ]
  },
  {
    id: 'dossier-10',
    operateurNom: 'NESTLE Cameroun SA',
    promoteurNom: 'Mme. Sylvie Eto\'o',
    telephone: '699112200',
    typeProduit: 'Céréales infantiles',
    responsable: 'Gestionnaire',
    dateTransmission: new Date(2023, 10, 20).toISOString(),
    status: 'en_attente',
    delai: 30,
    dateButoir: new Date(2023, 11, 19).toISOString(),
    historique: [
      {
        id: generateId(),
        dossierId: 'dossier-10',
        date: new Date().toISOString(),
        action: 'Dossier créé',
        responsable: 'System',
        commentaire: 'Dossier initial créé par le système.'
      }
    ]
  }
];

export const MOCK_NOTES_FRAIS: NoteFrais[] = [
  {
    id: 'note-1',
    dossierId: 'dossier-2',
    inspecteurId: 'insp-001',
    date: new Date().toISOString(),
    dateCreation: new Date().toISOString(),
    description: 'Frais de déplacement et de séjour pour inspection',
    montant: 50000,
    status: 'en_attente',
    fraisGestion: 10000,
    fraisInspection: 25000,
    fraisAnalyses: 15000
  },
  {
    id: 'note-2',
    dossierId: 'dossier-3',
    inspecteurId: 'insp-002',
    date: new Date().toISOString(),
    description: 'Frais de laboratoire pour analyses',
    montant: 75000,
    status: 'valide',
  },
];

export const MOCK_INSPECTIONS: Inspection[] = [
  {
    id: 'inspection-1',
    dossierId: 'dossier-2',
    dateInspection: new Date().toISOString(),
    lieu: 'Usine principale',
    inspecteurs: ['Insp. Martin', 'Insp. Dubois'],
    resultat: 'conforme',
    notes: 'Rapport détaillé de l\'inspection',
  },
  {
    id: 'inspection-2',
    dossierId: 'dossier-3',
    dateInspection: new Date().toISOString(),
    lieu: 'Site de production',
    inspecteurs: ['Insp. Kouassi', 'Insp. Eto\'o'],
    resultat: 'non_conforme',
    notes: 'Rapport détaillé de l\'inspection',
  },
];

export const MOCK_CERTIFICATS: Certificat[] = [
  {
    id: 'certificat-1',
    dossierId: 'dossier-2',
    numero: 'CERT-2024-001',
    dateDelivrance: new Date().toISOString(),
    dateExpiration: new Date(2025, 0, 1).toISOString(),
    entreprise: 'BOIS Sarl',
    produit: 'Eau minérale',
    status: 'actif',
  },
  {
    id: 'certificat-2',
    dossierId: 'dossier-3',
    numero: 'CERT-2024-002',
    dateDelivrance: new Date().toISOString(),
    dateExpiration: new Date(2025, 0, 1).toISOString(),
    entreprise: 'CATTIN Cameroon',
    produit: 'Conserves de légumes',
    status: 'actif',
  },
];

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

// Add mock documents
export const MOCK_DOCUMENTS: DocumentDossier[] = [
  {
    id: 'doc-1',
    dossierId: 'dossier-1',
    nom: 'Registre de Commerce',
    type: 'registre_commerce',
    url: 'https://example.com/docs/registre_commerce.pdf',
    dateUpload: new Date(2025, 4, 1).toISOString(),
    status: 'valide'
  },
  {
    id: 'doc-2',
    dossierId: 'dossier-1',
    nom: 'Carte de Contribuable',
    type: 'carte_contribuable',
    url: 'https://example.com/docs/carte_contribuable.pdf',
    dateUpload: new Date(2025, 4, 1).toISOString(),
    status: 'en_attente'
  },
  {
    id: 'doc-3',
    dossierId: 'dossier-1',
    nom: 'Schéma du processus de production',
    type: 'processus_production',
    url: 'https://example.com/docs/processus.pdf',
    dateUpload: new Date(2025, 4, 1).toISOString(),
    status: 'en_attente'
  },
  {
    id: 'doc-4',
    dossierId: 'dossier-2',
    nom: 'Registre de Commerce',
    type: 'registre_commerce',
    url: 'https://example.com/docs/registre_commerce2.pdf',
    dateUpload: new Date(2025, 4, 1).toISOString(),
    status: 'rejete'
  },
  {
    id: 'doc-5',
    dossierId: 'dossier-2',
    nom: 'Plan de localisation',
    type: 'plan_localisation',
    url: 'https://example.com/docs/plan.pdf',
    dateUpload: new Date(2025, 4, 2).toISOString(),
    status: 'valide'
  }
];
