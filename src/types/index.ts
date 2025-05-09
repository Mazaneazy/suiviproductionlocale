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
  commentaires?: string;
  comiteTechnique?: ComiteTechnique;
}

export interface NoteFrais {
  id: string;
  dossierId: string;
  inspecteurId: string;
  date: string;
  dateCreation?: string;
  description: string;
  montant: number;
  status: 'en_attente' | 'valide' | 'rejete';
  total?: number;
  deplacement?: number;
  hebergement?: number;
  restauration?: number;
  indemnites?: number;
  commentaire?: string;
  fichierUrl?: string;
  notificationEnvoyee?: boolean;
  operateurNotifie?: boolean;
  fraisGestion?: number;
  fraisInspection?: number;
  fraisAnalyses?: number;
  fraisSurveillance?: number;
  acquitte?: boolean;
}

export interface Inspection {
  id: string;
  dossierId: string;
  dateInspection: string;
  lieu: string;
  inspecteurs: string[];
  resultat: 'conforme' | 'non_conforme' | 'en_attente';
  notes?: string;
  recommandations?: string;
  actionsCorrectives?: string;
  planInspection?: string; // URL to the inspection plan document
  planEchantillonage?: string; // URL to the sampling plan document
  checklistComplete?: boolean;
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
  responsableQualiteId?: string;
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
  userId?: string;
  type?: 'warning' | 'alert' | 'info';
  link?: string;
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
  commentaire?: string;
}

export interface HistoriqueEvenement {
  id: string;
  dossierId: string;
  date: string;
  action: string;
  responsable: string;
  commentaire?: string;
}

export type UserRole = 'admin' | 'acceuil' | 'inspecteur' | 'certificats' | 'analyste' | 'comptable' | 'responsable_technique' | 'chef_mission' | 'surveillant' | 'directeur' | 'directeur_general' | 'gestionnaire' | 'producteur' | 'responsable_qualite' | 'comite_validation';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  password?: string;
  permissions?: string[];
  actions?: UserAction[];
  producteurDossierId?: string;
}

export interface UserAction {
  id: string;
  userId: string;
  date: string;
  action: string;
  details: string;
  module: string;
}

export interface RapportInspection {
  id: string;
  dossierId: string;
  inspectionId: string;
  date: string;
  contenu: string;
  fichierUrl?: string;
  status: 'en_attente' | 'transmis' | 'valide' | 'rejete';
  avisTechnique?: string;
  recommandations?: string;
}

export interface ComiteTechnique {
  id: string;
  dossierId: string;
  dateCreation: string;
  chefComite: MembreComite;
  membres: MembreComite[];
}

export interface MembreComite {
  id: string;
  nom: string;
  role: 'chef' | 'inspecteur' | 'analyste' | 'expert';
  specialite?: string;
}

export interface AvisDecision {
  id: string;
  dossierId: string;
  rapportId: string;
  date: string;
  contenu: string;
  resultat: 'favorable' | 'defavorable' | 'avec_reserves';
  commentaires?: string;
  status: 'en_attente' | 'transmis' | 'valide';
}

export interface ProcessVerbal {
  id: string;
  dossierId: string;
  avisId: string;
  date: string;
  contenu: string;
  decision: 'approuve' | 'rejete' | 'ajourne';
  signatures: string[];
}

export interface PreuvePaiement {
  id: string;
  noteFraisId: string;
  dossierId: string;
  date: string;
  montant: number;
  referencePaiement: string;
  fichierUrl: string;
  status: 'recu' | 'valide' | 'rejete';
  commentaires?: string;
}
