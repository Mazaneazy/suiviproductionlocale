
export interface NoteFrais {
  id: string;
  dossierId: string;
  inspecteurId: string;
  date: string;
  dateCreation: string;
  description: string;
  montant: number;
  status: 'en_attente' | 'valide' | 'rejete';
  acquitte: boolean;
  fraisGestion: number;
  fraisInspection: number;
  fraisAnalyses: number;
  fraisSurveillance: number;
  parametresAnalyse?: string[];
  // Additional properties used in the application
  commentaire?: string;
  fichierUrl?: string;
  notificationEnvoyee?: boolean;
  operateurNotifie?: boolean;
  total?: number;
  pdfUrl?: string;
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

export interface Transaction {
  id: string;
  date: string;
  montant: number;
  type: 'debit' | 'credit';
  description: string;
  reference: string;
  noteFraisId?: string;
}
