
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
  planInspection?: string;
  planEchantillonage?: string;
  checklistComplete?: boolean;
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
