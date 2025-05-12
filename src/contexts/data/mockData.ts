
import { Dossier, DocumentDossier, Inspection, NoteFrais, User } from '../../types';
import { generateId } from './utils';
import { PRODUITS_CAMEROUNAIS, OPERATEURS_CAMEROUNAIS, NOMS_CAMEROUNAIS } from './mockConstants';
import { generateRandomStatus, generateRandomDate, generateRandomDelay, generateRandomHistory } from './mockUtils';
import { generateDossiers } from './mockDossiers';

// Comptes de démonstration pour faciliter les tests
export const DEMO_USERS = [
  {
    id: 'demo-admin',
    nom: 'Admin',
    prenom: 'Demo',
    name: 'Demo Admin',
    email: 'admin@demo.com',
    password: 'demo123',
    role: 'admin',
    telephone: '699123456',
    dateCreation: '2023-01-01T00:00:00.000Z',
    avatar: null
  },
  {
    id: 'demo-tech',
    nom: 'Responsable',
    prenom: 'Technique',
    name: 'Technique Responsable',
    email: 'tech@demo.com',
    password: 'demo123',
    role: 'responsable_technique',
    telephone: '699123457',
    dateCreation: '2023-01-01T00:00:00.000Z',
    avatar: null
  },
  {
    id: 'demo-dir',
    nom: 'Directeur',
    prenom: 'Evaluation',
    name: 'Evaluation Directeur',
    email: 'dir@demo.com',
    password: 'demo123',
    role: 'directeur_evaluation',
    telephone: '699123458',
    dateCreation: '2023-01-01T00:00:00.000Z',
    avatar: null
  },
  {
    id: 'demo-insp',
    nom: 'Inspecteur',
    prenom: 'Demo',
    name: 'Demo Inspecteur',
    email: 'inspecteur@demo.com',
    password: 'demo123',
    role: 'inspecteur',
    telephone: '699123459',
    dateCreation: '2023-01-01T00:00:00.000Z',
    avatar: null
  },
  {
    id: 'demo-prod',
    nom: 'Producteur',
    prenom: 'Demo',
    name: 'Demo Producteur',
    email: 'producteur@demo.com',
    password: 'demo123',
    role: 'producteur',
    telephone: '699123460',
    dateCreation: '2023-01-01T00:00:00.000Z',
    avatar: null
  }
];

// Utilisateurs fictifs pour les tests
export const MOCK_USERS: User[] = [
  {
    id: 'user1',
    nom: 'Kamga',
    prenom: 'Jean',
    name: 'Jean Kamga',
    email: 'jean.kamga@anor.cm',
    password: 'password',
    role: 'admin',
    telephone: '699123456',
    dateCreation: '2023-01-01T00:00:00.000Z',
    avatar: null
  },
  {
    id: 'user2',
    nom: 'Nkeng',
    prenom: 'Marie',
    name: 'Marie Nkeng',
    email: 'marie.nkeng@anor.cm',
    password: 'password',
    role: 'responsable_technique',
    telephone: '677889900',
    dateCreation: '2023-01-15T00:00:00.000Z',
    avatar: null
  },
  {
    id: 'user3',
    nom: 'Mbarga',
    prenom: 'Paul',
    name: 'Paul Mbarga',
    email: 'paul.mbarga@anor.cm',
    password: 'password',
    role: 'directeur_evaluation',
    telephone: '655443322',
    dateCreation: '2023-02-01T00:00:00.000Z',
    avatar: null
  },
  {
    id: 'user4',
    nom: 'Atangana',
    prenom: 'Sophie',
    name: 'Sophie Atangana',
    email: 'sophie.atangana@anor.cm',
    password: 'password',
    role: 'inspecteur',
    telephone: '699887766',
    dateCreation: '2023-02-15T00:00:00.000Z',
    avatar: null
  },
  {
    id: 'user5',
    nom: 'Essomba',
    prenom: 'Pierre',
    name: 'Pierre Essomba',
    email: 'pierre.essomba@anor.cm',
    password: 'password',
    role: 'inspecteur',
    telephone: '677665544',
    dateCreation: '2023-03-01T00:00:00.000Z',
    avatar: null
  }
];

// Générer des dossiers fictifs
export const MOCK_DOSSIERS = generateDossiers(50);

// Documents fictifs pour les tests
export const MOCK_DOCUMENTS: DocumentDossier[] = [
  {
    id: 'doc1',
    dossierId: '1',
    nom: 'Demande de certification.pdf',
    type: 'demande',
    url: '/documents/demande.pdf',
    dateUpload: '2023-01-05T00:00:00.000Z',
    status: 'valide',
    taille: 524288,
    format: 'pdf',
    uploadedBy: 'user2'
  },
  {
    id: 'doc2',
    dossierId: '1',
    nom: 'Fiche technique produit.pdf',
    type: 'fiche_technique',
    url: '/documents/fiche_technique.pdf',
    dateUpload: '2023-01-05T00:00:00.000Z',
    status: 'valide',
    taille: 1048576,
    format: 'pdf',
    uploadedBy: 'user2'
  },
  {
    id: 'doc3',
    dossierId: '1',
    nom: 'Rapport de test interne.pdf',
    type: 'rapport',
    url: '/documents/rapport_test.pdf',
    dateUpload: '2023-01-05T00:00:00.000Z',
    status: 'en_attente',
    taille: 2097152,
    format: 'pdf',
    uploadedBy: 'user2'
  },
  {
    id: 'doc4',
    dossierId: '2',
    nom: 'Demande de certification.pdf',
    type: 'demande',
    url: '/documents/demande2.pdf',
    dateUpload: '2023-02-20T00:00:00.000Z',
    status: 'valide',
    taille: 524288,
    format: 'pdf',
    uploadedBy: 'user2'
  },
  {
    id: 'doc5',
    dossierId: '2',
    nom: 'Fiche technique produit.pdf',
    type: 'fiche_technique',
    url: '/documents/fiche_technique2.pdf',
    dateUpload: '2023-02-20T00:00:00.000Z',
    status: 'valide',
    taille: 1048576,
    format: 'pdf',
    uploadedBy: 'user2'
  }
];

// Inspections fictives pour les tests
export const MOCK_INSPECTIONS: Inspection[] = [
  {
    id: 'insp1',
    dossierId: '1',
    dateInspection: '2023-02-15T00:00:00.000Z',
    lieu: 'Usine SOTRACOM, Douala',
    inspecteurs: ['Sophie Atangana', 'Pierre Essomba'],
    resultat: 'conforme',
    rapport: {
      id: 'rap1',
      inspectionId: 'insp1',
      dateCreation: '2023-02-16T00:00:00.000Z',
      auteur: 'Sophie Atangana',
      titre: 'Rapport d\'inspection SOTRACOM',
      contenu: 'Le produit est conforme aux normes requises.',
      conclusion: 'Favorable',
      recommandations: 'Maintenir le niveau de qualité actuel',
      photos: ['/photos/inspection1_1.jpg', '/photos/inspection1_2.jpg'],
      statut: 'valide'
    }
  },
  {
    id: 'insp2',
    dossierId: '2',
    dateInspection: '2023-03-10T00:00:00.000Z',
    lieu: 'Usine NESTLE, Douala',
    inspecteurs: ['Pierre Essomba'],
    resultat: 'en_attente',
    rapport: null
  }
];

// Notes de frais fictives pour les tests
export const MOCK_NOTES_FRAIS: NoteFrais[] = [
  {
    id: 'nf1',
    dossierId: '1',
    inspecteurId: 'user4',
    date: '2023-02-15',
    dateCreation: '2023-02-16T00:00:00.000Z',
    description: 'Frais d\'inspection SOTRACOM',
    montant: 175000,
    status: 'valide',
    acquitte: true,
    fraisGestion: 50000,
    fraisInspection: 75000,
    fraisAnalyses: 10000,
    fraisSurveillance: 40000,
    parametresAnalyse: ['pH', 'Résistance', 'Composition chimique']
  },
  {
    id: 'nf2',
    dossierId: '2',
    inspecteurId: 'user5',
    date: '2023-03-10',
    dateCreation: '2023-03-11T00:00:00.000Z',
    description: 'Frais d\'inspection NESTLE',
    montant: 185000,
    status: 'en_attente',
    acquitte: false,
    fraisGestion: 50000,
    fraisInspection: 75000,
    fraisAnalyses: 20000,
    fraisSurveillance: 40000,
    parametresAnalyse: ['Qualité nutritionnelle', 'Microbiologie', 'Emballage']
  }
];

// Certificats fictifs pour les tests
export const MOCK_CERTIFICATS = [
  {
    id: 'cert1',
    dossierId: '1',
    numero: 'ANOR-2023-001',
    dateDelivrance: '2023-03-01T00:00:00.000Z',
    dateExpiration: '2025-03-01T00:00:00.000Z',
    status: 'actif',
    produit: 'Ciment',
    operateur: 'SOTRACOM',
    normeReference: 'NC 234-2019',
    logo: '/logos/anor_certified.png',
    responsableQualiteId: 'user2'
  }
];

// Notifications fictives pour les tests
export const MOCK_NOTIFICATIONS = [
  {
    id: 'notif1',
    userId: 'user2',
    titre: 'Nouveau dossier assigné',
    message: 'Un nouveau dossier SOTRACOM vous a été assigné',
    dateCreation: '2023-01-02T00:00:00.000Z',
    lu: true,
    type: 'info',
    lien: '/dossiers/1'
  },
  {
    id: 'notif2',
    userId: 'user4',
    titre: 'Inspection programmée',
    message: 'Vous êtes assigné(e) à l\'inspection SOTRACOM le 15/02/2023',
    dateCreation: '2023-02-10T00:00:00.000Z',
    lu: false,
    type: 'info',
    lien: '/inspections/insp1'
  },
  {
    id: 'notif3',
    userId: 'user3',
    titre: 'Rapport d\'inspection à valider',
    message: 'Un nouveau rapport d\'inspection est disponible pour validation',
    dateCreation: '2023-02-16T00:00:00.000Z',
    lu: false,
    type: 'info',
    lien: '/rapports/rap1'
  },
  {
    id: 'notif4',
    userId: 'user5',
    titre: 'Inspection programmée',
    message: 'Vous êtes assigné(e) à l\'inspection NESTLE le 10/03/2023',
    dateCreation: '2023-03-05T00:00:00.000Z',
    lu: false,
    type: 'info',
    lien: '/inspections/insp2'
  }
];
