
export interface Certificat {
  id: string;
  dossier_id: string;
  dossierId?: string;
  numero: string;
  date_emission: string;
  dateEmission?: string;
  dateDelivrance?: string;
  date_expiration: string;
  dateExpiration?: string;
  status?: 'actif' | 'expire' | 'suspendu' | 'revoque';
  type?: string;
  norme: string;
  normeReference?: string;
  emis_par?: string;
  emisPar?: string;
  entreprise?: string;
  produit?: string;
  fichier_url?: string;
  fichierUrl?: string;
  signature_url?: string;
  signatureUrl?: string;
}

export interface Norme {
  id: string;
  code: string;
  titre: string;
  description?: string;
  categorie?: string;
  version?: string;
  date_publication?: string;
}

export interface ComiteTechnique {
  id: string;
  dossier_id: string;
  date_creation: string;
  membres: MembreComite[];
}

export interface MembreComite {
  id: string;
  nom: string;
  role: 'chef' | 'inspecteur' | 'analyste' | 'expert';
  specialite?: string;
  organisme?: string;
  contact?: string;
}
