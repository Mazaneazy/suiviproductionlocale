
export interface Notification {
  id: string;
  message: string;
  date: string;
  lue: boolean;
  type: 'info' | 'warning' | 'error' | 'success';
  lienDossier?: string;
  destinataireId?: string;
  // Add properties used in mock notifications
  userId?: string;
  titre?: string;
  lien?: string;
  dateCreation?: string;
  lu?: boolean;
}

export interface Statistique {
  totalDossiers: number;
  enAttente: number;
  enCours: number;
  complet: number;
  rejete: number;
  certifie: number;
  aCorrection: number;
  tauxRejection: number;
  delaiMoyenTraitement: number;
  certificationsParMois: Record<string, number>;
  dossiersParStatut: Record<string, number>;
  dossiersParProduit: Record<string, number>;
  // Add the properties being used elsewhere in the codebase
  dossiersEnCours?: number;
  dossiersCertifies?: number;
  dossiersRejetes?: number;
}
