
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
  numeroCertificat?: string;
  normeReference?: string;
  dateEmission?: string;
  // Add missing properties used in the mock data
  operateur?: string;
  logo?: string;
}

export interface ResultatConformite {
  id: string;
  certificatId: string;
  dateEvaluation: string;
  conclusion: string;
  rapport: string;
}
