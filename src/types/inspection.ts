
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
}

export interface RapportInspection {
  id: string;
  inspection_id: string;
  inspectionId: string;
  date_creation: string;
  statut: 'brouillon' | 'soumis' | 'valide' | 'rejete';
  fichier_url?: string;
  commentaires?: string;
  non_conformites?: string[];
  observations?: string[];
  conclusion: string;
  date_soumission?: string;
  redacteur: string;
  validateur?: string;
  date_validation?: string;
  resultat_conformite?: 'conforme' | 'non_conforme' | 'conforme_avec_reserve';
}

export interface AvisDecision {
  id: string;
  dossier_id: string;
  date_creation: string;
  decision: 'favorable' | 'defavorable' | 'reserve';
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
