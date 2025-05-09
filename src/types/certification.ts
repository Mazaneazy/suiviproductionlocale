
export interface Certificat {
  id: string;
  dossierId: string;
  numero: string;
  entreprise: string;
  produit: string;
  dateDelivrance: string;
  dateExpiration: string;
  status: 'actif' | 'suspendu' | 'retire' | 'expire';
  resultatConformite?: ResultatConformite;
  responsableQualiteId?: string;
}

export interface ResultatConformite {
  id: string;
  certificatId: string;
  dateEvaluation: string;
  conclusion: string;
  rapport: string;
}
