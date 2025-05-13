
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
  fraisGestion?: number;
  fraisInspection?: number;
  fraisAnalyses?: number;
  fraisSurveillance?: number;
  commentaire?: string;
  fichierUrl?: string;
  operateurNotifie?: boolean;
  notificationEnvoyee?: boolean;
  total?: number;
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
