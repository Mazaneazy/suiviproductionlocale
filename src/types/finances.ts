
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
