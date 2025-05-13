
export interface NoteFrais {
  id: string;
  dossier_id?: string;
  dossierId?: string;
  inspecteur_id?: string;
  date: string;
  montant: number;
  acquitte: boolean;
  frais_gestion: number;
  frais_inspection: number;
  frais_analyses: number;
  frais_surveillance: number;
  notification_envoyee: boolean;
  operateur_notifie: boolean;
  parametres_analyse?: string[];
  description?: string;
  status: 'en_attente' | 'validee' | 'rejetee';
  commentaire?: string;
  fichier_url?: string;
}

export interface PreuvePaiement {
  id: string;
  notefrais_id: string;
  fichier_url: string;
  date_upload: string;
  uploaded_by: string;
  validation_status: 'en_attente' | 'acceptee' | 'rejetee';
  commentaire?: string;
}
