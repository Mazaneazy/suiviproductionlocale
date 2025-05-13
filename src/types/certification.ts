
export interface Certificat {
  id: string;
  numero: string;
  dossier_id?: string;
  dossierId?: string;
  date_emission: string;
  date_expiration: string;
  entreprise: string;
  produit: string;
  emis_par?: string;
  status: 'valide' | 'expire' | 'suspendu' | 'annule';
  norme?: string;
  fichier_url?: string;
  signature_url?: string;
}
