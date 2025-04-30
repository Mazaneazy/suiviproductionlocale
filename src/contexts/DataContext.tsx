
import React, { createContext, useState, useContext } from 'react';
import { Dossier, NoteFrais, Inspection, Certificat, Notification, Statistique, DocumentDossier } from '../types';
import { DataContextProps } from './data/types';
import { MOCK_DOSSIERS, MOCK_NOTES_FRAIS, MOCK_INSPECTIONS, MOCK_CERTIFICATS, MOCK_NOTIFICATIONS } from './data/mockData';
import { generateId, calculateStatistics } from './data/utils';

// Create the context with default values
const DataContext = createContext<DataContextProps>({
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

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with mock data
  const [dossiers, setDossiers] = useState<Dossier[]>(MOCK_DOSSIERS);
  const [notesFrais, setNotesFrais] = useState<NoteFrais[]>(MOCK_NOTES_FRAIS);
  const [inspections, setInspections] = useState<Inspection[]>(MOCK_INSPECTIONS);
  const [certificats, setCertificats] = useState<Certificat[]>(MOCK_CERTIFICATS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [documents, setDocuments] = useState<DocumentDossier[]>([]);
  const [statistiques, setStatistiques] = useState<Statistique>(calculateStatistics(MOCK_DOSSIERS));

  const addDossier = (dossier: Omit<Dossier, 'id'>) => {
    const newDossier = { ...dossier, id: generateId() };
    setDossiers([...dossiers, newDossier]);
    updateStatistiques([...dossiers, newDossier]);
  };

  const updateDossier = (id: string, data: Partial<Dossier>) => {
    const updated = dossiers.map(dossier => 
      dossier.id === id ? { ...dossier, ...data } : dossier
    );
    setDossiers(updated);
    updateStatistiques(updated);
  };

  const addNoteFrais = (noteFrais: Omit<NoteFrais, 'id'>) => {
    const newNoteFrais = { ...noteFrais, id: generateId() };
    setNotesFrais([...notesFrais, newNoteFrais]);
  };

  const updateNoteFrais = (id: string, data: Partial<NoteFrais>) => {
    setNotesFrais(notesFrais.map(note => 
      note.id === id ? { ...note, ...data } : note
    ));
  };

  const addInspection = (inspection: Omit<Inspection, 'id'>) => {
    const newInspection = { ...inspection, id: generateId() };
    setInspections([...inspections, newInspection]);
  };

  const updateInspection = (id: string, data: Partial<Inspection>) => {
    setInspections(inspections.map(inspection => 
      inspection.id === id ? { ...inspection, ...data } : inspection
    ));
  };

  const addCertificat = (certificat: Omit<Certificat, 'id'>) => {
    const newCertificat = { ...certificat, id: generateId() };
    setCertificats([...certificats, newCertificat]);
    
    // Mettre à jour le statut du dossier
    updateDossier(certificat.dossierId, { status: 'certifie' });
  };

  const updateCertificat = (id: string, data: Partial<Certificat>) => {
    setCertificats(certificats.map(certificat => 
      certificat.id === id ? { ...certificat, ...data } : certificat
    ));
  };

  const addDocument = (document: Omit<DocumentDossier, 'id'>) => {
    // Explicitly set the status to 'en_attente' as a valid DocumentDossier status
    const newDocument = { 
      ...document, 
      id: generateId(), 
      status: 'en_attente' as const 
    };
    setDocuments([...documents, newDocument]);
  };

  const removeDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const updateDocument = (id: string, data: Partial<DocumentDossier>) => {
    setDocuments(documents.map(doc => 
      doc.id === id ? { ...doc, ...data } : doc
    ));
  };

  const getDossierById = (id: string) => {
    return dossiers.find(dossier => dossier.id === id);
  };

  const getDocumentsByDossierId = (dossierId: string) => {
    return documents.filter(doc => doc.dossierId === dossierId);
  };

  const getNoteFraisByDossierId = (dossierId: string) => {
    return notesFrais.filter(note => note.dossierId === dossierId);
  };

  const getInspectionsByDossierId = (dossierId: string) => {
    return inspections.filter(inspection => inspection.dossierId === dossierId);
  };

  const getCertificatByDossierId = (dossierId: string) => {
    return certificats.find(certificat => certificat.dossierId === dossierId);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, lue: true } : notif
    ));
  };

  const getUnreadNotificationsCount = () => {
    return notifications.filter(notif => !notif.lue).length;
  };

  const updateStatistiques = (updatedDossiers: Dossier[]) => {
    setStatistiques(calculateStatistics(updatedDossiers));
  };

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

export const useData = () => useContext(DataContext);
