
import React from 'react';
import { DataContextProps } from './data/types';
import { DataProvider as DataProviderImplementation } from './data/DataProvider';

// Create the context with default values
const DataContext = React.createContext<DataContextProps>({
  dossiers: [],
  notesFrais: [],
  inspections: [],
  certificats: [],
  notifications: [],
  statistiques: {
    totalDossiers: 0,
    dossiersCertifies: 0,
    dossiersEnCours: 0,
    dossiersRejetes: 0,
    delaiMoyenTraitement: 0,
  },
  addDossier: () => {},
  updateDossier: () => {},
  addNoteFrais: () => {},
  updateNoteFrais: () => {},
  addInspection: () => {},
  updateInspection: () => {},
  addCertificat: () => {},
  updateCertificat: () => {},
  addDocument: () => {},
  removeDocument: () => {},
  updateDocument: () => {},
  getDossierById: () => undefined,
  getDocumentsByDossierId: () => [],
  getNoteFraisByDossierId: () => [],
  getInspectionsByDossierId: () => [],
  getCertificatByDossierId: () => undefined,
  markNotificationAsRead: () => {},
  getUnreadNotificationsCount: () => 0,
});

// Re-export the Provider with the same name for backward compatibility
export const DataProvider = DataProviderImplementation;

// Export the useData hook for components to use
export const useData = () => React.useContext(DataContext);

// Export the context for the implementation to use
export default DataContext;
