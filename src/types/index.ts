
export type UserRole = 'admin' | 'acceuil' | 'inspecteur' | 'analyste' | 'surveillant' | 'comptable' | 'directeur';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Dossier {
  id: string;
  operateurNom: string;
  typeProduit: string;
  dateTransmission: string;
  responsable: string;
  status: 'complet' | 'en_attente' | 'rejete' | 'en_cours' | 'certifie';
  delai: number; // délai en jours
  dateButoir: string;
}

export interface NoteFrais {
  id: string;
  dossierId: string;
  inspecteurId: string;
  dateCreation: string;
  deplacement: number;
  hebergement: number;
  restauration: number;
  indemnites: number;
  status: 'en_attente' | 'validee' | 'rejetee';
  commentaire?: string;
  fichierUrl?: string;
  notificationEnvoyee?: boolean;
  operateurNotifie?: boolean;
}

export interface Inspection {
  id: string;
  dossierId: string;
  dateInspection: string;
  lieu: string;
  inspecteurs: string[];
  resultat: 'conforme' | 'non_conforme' | 'en_attente';
  recommandations?: string;
  actionsCorrectives?: string;
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
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'info' | 'warning' | 'alert';
  lue: boolean;
  date: string;
  link?: string;
}

export interface Statistique {
  totalDossiers: number;
  dossiersCertifies: number;
  dossiersEnCours: number;
  dossiersRejetes: number;
  delaiMoyenTraitement: number; // en jours
}
