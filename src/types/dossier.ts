
export interface Dossier {
  id: string;
  delai?: number;
  operateur_nom: string;
  operateurNom?: string;
  reference?: string;
  operateur_email?: string;
  operateur_telephone?: string;
  type_produit?: string;
  typeProduit?: string;
  status: 'en_attente' | 'en_cours' | 'complet' | 'rejete' | 'a_corriger' | 'certifie';
  date_creation?: string;
  dateCreation?: string;
  date_transmission?: string;
  dateTransmission?: string;
  date_butoir?: string;
  dateButoir?: string;
  responsable?: string;
  commentaires?: string;
  historique?: HistoriqueEvenement[];
  pilote_technique_id?: string;
  piloteTechniqueId?: string;
  piloteTechniqueNom?: string;
  documents_ids?: string[];
  documentsIds?: string[];
  promoteurNom: string;      // ajouter si manquant
  telephone: string;         // ajouter si manquant
  parametresEvaluation?: any;
  comiteTechnique?: ComiteTechnique;
}


export interface HistoriqueEvenement {
  id: string;
  dossierId: string;
  date: string;
  action: string;
  responsable: string;
  commentaire?: string;
}

export interface ParametreEvaluation {
  id: string;
  nom: string;
  description?: string;
  prix: number;
  unite?: string;
  categorie?: string;
}
