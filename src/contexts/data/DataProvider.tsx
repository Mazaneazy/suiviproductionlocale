
import React, { useState } from 'react';
import DataContext from '../DataContext';
import { useDossiers } from './hooks/useDossiers';
import { useNotesFrais } from './hooks/useNotesFrais';
import { useInspections } from './hooks/useInspections';
import { useCertificats } from './hooks/useCertificats';
import { useDocuments } from './hooks/useDocuments';
import { useNotifications } from './hooks/useNotifications';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize hooks that manage different data domains
  const {
    dossiers,
    addDossier,
    updateDossier,
    getDossierById,
    statistiques
  } = useDossiers();

  const {
    notesFrais,
    addNoteFrais,
    updateNoteFrais,
    getNoteFraisByDossierId
  } = useNotesFrais(updateDossier);

  const {
    inspections,
    addInspection,
    updateInspection,
    getInspectionsByDossierId
  } = useInspections(updateDossier);
  
  const {
    certificats,
    addCertificat,
    updateCertificat,
    getCertificatByDossierId
  } = useCertificats(updateDossier);
  
  const {
    documents,
    addDocument,
    removeDocument,
    updateDocument,
    getDocumentsByDossierId
  } = useDocuments(updateDossier);

  const {
    notifications,
    markNotificationAsRead,
    getUnreadNotificationsCount
  } = useNotifications();

  return (
    <DataContext.Provider value={{
      dossiers,
      notesFrais,
      inspections,
      certificats,
      notifications,
      statistiques,
      addDossier,
      updateDossier,
      addNoteFrais,
      updateNoteFrais,
      addInspection,
      updateInspection,
      addCertificat,
      updateCertificat,
      addDocument,
      removeDocument,
      updateDocument,
      getDossierById,
      getDocumentsByDossierId,
      getNoteFraisByDossierId,
      getInspectionsByDossierId,
      getCertificatByDossierId,
      markNotificationAsRead,
      getUnreadNotificationsCount,
    }}>
      {children}
    </DataContext.Provider>
  );
};
