export interface Dossier {
  id: string;
  operateurNom: string;
  promoteurNom: string;
  telephone: string;
  typeProduit: string;
  responsable: string;
  dateTransmission: string;
  status: 'en_attente' | 'en_cours' | 'complet' | 'rejete' | 'certifie' | 'a_corriger';
  delai: number;
  dateButoir: string;
  historique?: HistoriqueEvenement[];
  parametresEvaluation?: string[];
  commentaires?: string; // Added property
  documents?: DocumentDossier[] | Omit<DocumentDossier, 'id'>[]; // Added property for documents
}

export interface NoteFrais {
  id: string;
  dossierId: string;
  inspecteurId: string;
  date: string;
  dateCreation?: string; // Added property
  description: string;
  montant: number;
  status: 'en_attente' | 'valide' | 'rejete';
  total?: number;
  deplacement?: number; // Added property
  hebergement?: number; // Added property
  restauration?: number; // Added property
  indemnites?: number; // Added property
  commentaire?: string; // Added property
  fichierUrl?: string; // Added property
  notificationEnvoyee?: boolean; // Added property
  operateurNotifie?: boolean; // Added property
  fraisGestion?: number; // Added property
  fraisInspection?: number; // Added property
  fraisAnalyses?: number; // Added property
  fraisSurveillance?: number; // Added property
}

export interface Inspection {
  id: string;
  dossierId: string;
  dateInspection: string;
  lieu: string;
  inspecteurs: string[];
  resultat: 'conforme' | 'non_conforme' | 'en_attente';
  notes?: string;
  recommandations?: string; // Added property
  actionsCorrectives?: string; // Added property
}

export interface Certificat {
  id: string;
  dossierId: string;
  numero: string;
  entreprise: string;
  produit: string;
  dateDelivrance: string;
  dateExpiration: string;
  status: 'actif' | 'suspendu' | 'retire' | 'expire';
  resultatConformite?: ResultatConformite;
}

export interface ResultatConformite {
  id: string;
  certificatId: string;
  dateEvaluation: string;
  conclusion: string;
  rapport: string;
}

export interface Notification {
  id: string;
  message: string;
  date: string;
  lue: boolean;
  userId?: string; // Added property
  type?: 'warning' | 'alert' | 'info'; // Added property
  link?: string; // Added property
}

export interface Statistique {
  totalDossiers: number;
  dossiersCertifies: number;
  dossiersEnCours: number;
  dossiersRejetes: number;
  delaiMoyenTraitement: number;
}

export interface DocumentDossier {
  id: string;
  dossierId: string;
  nom: string;
  type: string;
  dateUpload: string;
  url: string;
  status?: 'valide' | 'rejete' | 'en_attente';
  commentaire?: string; // Added property
}

export interface HistoriqueEvenement {
  id: string;
  dossierId: string;
  date: string;
  action: string;
  responsable: string;
  commentaire?: string;
}

export type UserRole = 'admin' | 'acceuil' | 'inspecteur' | 'certificats' | 'analyste' | 'comptable' | 'responsable_technique' | 'chef_mission' | 'surveillant' | 'directeur' | 'directeur_general' | 'gestionnaire' | 'producteur';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  password?: string; // Only used for mock authentication
  permissions?: string[];
  actions?: UserAction[];
  producteurDossierId?: string; // ID du dossier associé au compte producteur
}

export interface UserAction {
  id: string;
  userId: string;
  date: string;
  action: string;
  details: string;
  module: string;
}
