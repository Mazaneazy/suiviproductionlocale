
export interface Certificat {
  id: string;
  dossierId: string;
  numero: string;
  dateDelivrance: string;
  dateExpiration: string;
  entreprise: string;
  produit: string;
  status: 'actif' | 'expire' | 'suspendu' | 'revoque';
  responsableQualiteId: string;
  resultatConformite?: ResultatConformite;
}

export interface ResultatConformite {
  id: string;
  certificatId: string;
  dateEvaluation: string;
  conclusion: string;
  rapport: string;
}
