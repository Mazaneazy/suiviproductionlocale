
export interface NoteFrais {
  id: string;
  dossier_id?: string;
  dossierId?: string;
  inspecteur_id?: string;
  inspecteurId?: string;
  date: string;
  date_creation?: string;
  dateCreation?: string;
  montant: number;
  acquitte: boolean;
  frais_gestion?: number;
  fraisGestion?: number;
  frais_inspection?: number;
  fraisInspection?: number;
  frais_analyses?: number;
  fraisAnalyses?: number;
  frais_surveillance?: number;
  fraisSurveillance?: number;
  notification_envoyee?: boolean;
  notificationEnvoyee?: boolean;
  operateur_notifie?: boolean;
  operateurNotifie?: boolean;
  parametres_analyse?: string[];
  parametresAnalyse?: string[];
  parametresEvaluation?: string[];
  description?: string;
  status: 'en_attente' | 'validee' | 'rejetee' | 'valide' | 'rejete';
  commentaire?: string;
  fichier_url?: string;
  fichierUrl?: string;
}

export interface PreuvePaiement {
  id: string;
  notefrais_id?: string;
  noteFraisId?: string;
  dossier_id?: string;
  dossierId?: string;
  fichier_url?: string;
  fichierUrl?: string;
  date_upload?: string;
  date?: string;
  uploaded_by?: string;
  validation_status?: 'en_attente' | 'acceptee' | 'rejetee';
  commentaire?: string;
  montant?: number;
  referencePaiement?: string;
  status?: string;
  commentaires?: string;
}

export interface FactureDetails {
  id: string;
  numero: string;
  date: string;
  montant: number;
  dossier_id: string;
  status: 'en_attente' | 'payee' | 'annulee';
  details?: string;
}
