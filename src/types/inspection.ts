
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
  inspectionId: string;
  dateCreation: string;
  auteur: string;
  titre: string;
  contenu: string;
  conclusion: string;
  recommandations: string;
  statut: 'brouillon' | 'soumis' | 'valide' | 'rejete';
  fichierUrl?: string;
  // Add missing properties used in components
  dossierId?: string;
  date?: string;
  status?: string;
  avisTechnique?: string;
}

export interface AvisDecision {
  id: string;
  rapportId: string;
  dateCreation: string;
  auteur: string;
  decision: 'favorable' | 'defavorable' | 'avec_reserve';
  justification: string;
  actions: string[];
  // Add missing properties used in components
  dossierId?: string;
  date?: string;
  contenu?: string;
  resultat?: 'favorable' | 'defavorable' | 'avec_reserves';
  commentaires?: string;
  status?: string;
}
