
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
