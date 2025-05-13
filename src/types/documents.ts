
export interface DocumentDossier {
  id: string;
  dossierId: string;
  nom: string;
  type: string;
  dateUpload: string;
  taille: number;
  format: string;
  uploadedBy: string;
  status?: 'valide' | 'rejete' | 'en_attente';
  commentaire?: string;
  url?: string;
  accessiblePublic?: boolean; // Permet au chargé de clientèle d'accéder au document
}
