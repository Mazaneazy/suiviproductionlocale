
export interface Notification {
  id: string;
  message: string;
  date: string;
  lue: boolean;
  userId?: string;
  type?: 'warning' | 'alert' | 'info';
  link?: string;
}

export interface Statistique {
  totalDossiers: number;
  dossiersCertifies: number;
  dossiersEnCours: number;
  dossiersRejetes: number;
  delaiMoyenTraitement: number;
}
