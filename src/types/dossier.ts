
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
  piloteTechniqueId?: string;
  piloteTechniqueNom?: string;
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
