
import React from 'react';
import { DataContextProps } from './data/types';

// Create the context with default values
const DataContext = React.createContext<DataContextProps>({
  dossiers: [],
  notesFrais: [],
  inspections: [],
  certificats: [],
  notifications: [],
  statistiques: {
    totalDossiers: 0,
    enAttente: 0,
    enCours: 0,
    complet: 0,
    rejete: 0,
    certifie: 0,
    aCorrection: 0,
    tauxRejection: 0,
    delaiMoyenTraitement: 0,
    certificationsParMois: {},
    dossiersParStatut: {},
    dossiersParProduit: {},
    dossiersEnCours: 0,
    dossiersCertifies: 0,
    dossiersRejetes: 0
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

// Export the context for the implementation to use
export default DataContext;

// Export the useData hook for components to use
export const useData = () => React.useContext(DataContext);

// Import and re-export the Provider from a separate file
import { DataProvider as DataProviderImplementation } from './data/DataProvider';
export const DataProvider = DataProviderImplementation;
