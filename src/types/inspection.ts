
export interface Inspection {
  id: string;
  dossier_id?: string;
  dossierId?: string;
  status: 'planifiee' | 'realisee' | 'annulee' | 'reportee';
  resultat?: string;
  rapport_url?: string;
  commentaires?: string;
  points_controle?: string[];
  objectifs?: string;
  inspecteurs?: string[];
  responsable?: string;
  date_creation: string;
  dateInspection?: string;
  date_inspection: string;
  // Additional properties used in components
  lieu?: string;
  notes?: string;
  recommandations?: string;
  actionsCorrectives?: string;
  planInspection?: string;
  planEchantillonage?: string;
  checklistComplete?: boolean;
}

export interface RapportInspection {
  id: string;
  inspection_id: string;
  inspectionId?: string;
  date_creation: string;
  dateCreation?: string;
  statut: 'brouillon' | 'soumis' | 'valide' | 'rejete';
  status?: 'brouillon' | 'soumis' | 'valide' | 'rejete';
  fichier_url?: string;
  fichierUrl?: string;
  commentaires?: string;
  non_conformites?: string[];
  observations?: string[];
  conclusion: string;
  date_soumission?: string;
  date?: string;
  redacteur: string;
  validateur?: string;
  date_validation?: string;
  resultat_conformite?: 'conforme' | 'non_conforme' | 'conforme_avec_reserve';
}

export interface AvisDecision {
  id: string;
  dossier_id: string;
  date_creation: string;
  decision: 'favorable' | 'defavorable' | 'reserve' | 'avec_reserve';
  motifs: string;
  recommandations?: string[];
  responsable: string;
  validateur?: string;
  date_validation?: string;
}

export interface ResultatConformite {
  id: string;
  dossier_id: string;
  rapport_id: string;
  date_evaluation: string;
  niveau_conformite: 'A' | 'B' | 'C' | 'D' | 'E';
  responsable: string;
  commentaires?: string;
}
