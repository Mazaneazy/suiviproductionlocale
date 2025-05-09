
import { Dossier, NoteFrais, Inspection, Certificat, Notification, Statistique, DocumentDossier, HistoriqueEvenement, ResultatConformite } from '../../types';

export interface DataContextProps {
  dossiers: Dossier[];
  notesFrais: NoteFrais[];
  inspections: Inspection[];
  certificats: Certificat[];
  notifications: Notification[];
  statistiques: Statistique;
  addDossier: (dossier: Omit<Dossier, 'id'>) => void;
  updateDossier: (id: string, data: Partial<Dossier>) => void;
  addNoteFrais: (noteFrais: Omit<NoteFrais, 'id'>) => void;
  updateNoteFrais: (id: string, data: Partial<NoteFrais>) => void;
  addInspection: (inspection: Omit<Inspection, 'id'>) => void;
  updateInspection: (id: string, data: Partial<Inspection>) => void;
  addCertificat: (certificat: Omit<Certificat, 'id'>) => void;
  updateCertificat: (id: string, data: Partial<Certificat>) => void;
  addDocument: (document: Omit<DocumentDossier, 'id'>) => void;
  removeDocument: (id: string) => void;
  updateDocument: (id: string, data: Partial<DocumentDossier>) => void;
  getDossierById: (id: string) => Dossier | undefined;
  getDocumentsByDossierId: (dossierId: string) => DocumentDossier[];
  getNoteFraisByDossierId: (dossierId: string) => NoteFrais[];
  getInspectionsByDossierId: (dossierId: string) => Inspection[];
  getCertificatByDossierId: (dossierId: string) => Certificat | undefined;
  markNotificationAsRead: (id: string) => void;
  getUnreadNotificationsCount: () => number;
}
