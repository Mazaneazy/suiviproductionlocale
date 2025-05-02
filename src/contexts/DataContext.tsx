
import React, { createContext, useState, useContext } from 'react';
import { Dossier, NoteFrais, Inspection, Certificat, Notification, Statistique, DocumentDossier } from '../types';
import { DataContextProps } from './data/types';
import { MOCK_DOSSIERS, MOCK_NOTES_FRAIS, MOCK_INSPECTIONS, MOCK_CERTIFICATS, MOCK_NOTIFICATIONS } from './data/mockData';
import { calculateStatistics } from './data/utils';
import { 
  createDossier,
  updateDossierStatus
} from './data/services/dossierService';
import {
  createNoteFrais,
  createNoteFraisHistorique
} from './data/services/noteFraisService';
import {
  createInspection,
  createInspectionHistorique,
  createInspectionResultHistorique
} from './data/services/inspectionService';
import {
  createCertificat,
  createCertificatHistorique,
  createCertificatStatusHistorique
} from './data/services/certificatService';
import {
  createDocument,
  createDocumentHistorique,
  createDocumentRemovalHistorique,
  createDocumentStatusHistorique
} from './data/services/documentService';
import {
  createNotification,
  countUnreadNotifications,
  markNotificationAsRead as markAsRead
} from './data/services/notificationService';

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

  // Notification helper function
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification = createNotification(notification);
    setNotifications(prev => [...prev, newNotification]);
  };

  // Dossier functions
  const addDossier = (dossier: Partial<Dossier>) => {
    const { newDossier, dossiersDocuments } = createDossier(dossier, addNotification);
    
    if (dossiersDocuments && dossiersDocuments.length > 0) {
      setDocuments(prevDocuments => [...prevDocuments, ...dossiersDocuments]);
    }
    
    const updatedDossiers = [...dossiers, newDossier];
    setDossiers(updatedDossiers);
    updateStatistiques(updatedDossiers);
  };
  
  const updateDossier = (id: string, data: Partial<Dossier>) => {
    const dossier = dossiers.find(d => d.id === id);
    if (!dossier) return;

    // Create historique event if status changes
    if (data.status) {
      const historiqueEvent = updateDossierStatus(dossier, data.status, data.responsable);
      if (historiqueEvent) {
        data.historique = [...(dossier.historique || []), historiqueEvent];
      }
    }
    
    const updated = dossiers.map(dossier => 
      dossier.id === id ? { ...dossier, ...data } : dossier
    );
    setDossiers(updated);
    updateStatistiques(updated);
  };

  // Note de frais functions
  const addNoteFrais = (noteFrais: Omit<NoteFrais, 'id'>) => {
    const newNoteFrais = createNoteFrais(noteFrais);
    setNotesFrais([...notesFrais, newNoteFrais]);
    
    // Add to dossier history
    const dossier = dossiers.find(d => d.id === noteFrais.dossierId);
    if (dossier) {
      const historique = createNoteFraisHistorique(newNoteFrais);
      updateDossier(noteFrais.dossierId, {
        historique: [...(dossier.historique || []), historique]
      });
    }
  };

  const updateNoteFrais = (id: string, data: Partial<NoteFrais>) => {
    setNotesFrais(notesFrais.map(note => 
      note.id === id ? { ...note, ...data } : note
    ));
  };

  // Inspection functions
  const addInspection = (inspection: Omit<Inspection, 'id'>) => {
    const newInspection = createInspection(inspection);
    setInspections([...inspections, newInspection]);
    
    // Add to dossier history
    const dossier = dossiers.find(d => d.id === inspection.dossierId);
    if (dossier) {
      const historique = createInspectionHistorique(newInspection);
      updateDossier(inspection.dossierId, {
        historique: [...(dossier.historique || []), historique]
      });
    }
  };

  const updateInspection = (id: string, data: Partial<Inspection>) => {
    const inspection = inspections.find(i => i.id === id);
    if (!inspection) return;
    
    setInspections(inspections.map(inspection => 
      inspection.id === id ? { ...inspection, ...data } : inspection
    ));
    
    // Add to dossier history if result changes
    if (data.resultat) {
      const dossier = dossiers.find(d => d.id === inspection.dossierId);
      if (dossier) {
        const historique = createInspectionResultHistorique(inspection, data.resultat);
        if (historique) {
          updateDossier(inspection.dossierId, {
            historique: [...(dossier.historique || []), historique]
          });
        }
      }
    }
  };

  // Certificat functions
  const addCertificat = (certificat: Omit<Certificat, 'id'>) => {
    const newCertificat = createCertificat(certificat);
    setCertificats([...certificats, newCertificat]);
    
    // Mettre à jour le statut du dossier
    updateDossier(certificat.dossierId, { status: 'certifie' });
    
    // Add to dossier history
    const dossier = dossiers.find(d => d.id === certificat.dossierId);
    if (dossier) {
      const historique = createCertificatHistorique(newCertificat);
      updateDossier(certificat.dossierId, {
        historique: [...(dossier.historique || []), historique]
      });
    }
  };

  const updateCertificat = (id: string, data: Partial<Certificat>) => {
    const certificat = certificats.find(c => c.id === id);
    if (!certificat) return;
    
    setCertificats(certificats.map(certificat => 
      certificat.id === id ? { ...certificat, ...data } : certificat
    ));
    
    // Add to dossier history if status changes
    if (data.status) {
      const dossier = dossiers.find(d => d.id === certificat.dossierId);
      if (dossier) {
        const historique = createCertificatStatusHistorique(certificat, data.status);
        if (historique) {
          updateDossier(certificat.dossierId, {
            historique: [...(dossier.historique || []), historique]
          });
        }
      }
    }
  };

  // Document functions
  const addDocument = (document: Omit<DocumentDossier, 'id'>) => {
    const newDocument = createDocument(document);
    setDocuments([...documents, newDocument]);
    
    // Add to dossier history
    const dossier = dossiers.find(d => d.id === document.dossierId);
    if (dossier) {
      const historique = createDocumentHistorique(newDocument);
      updateDossier(document.dossierId, {
        historique: [...(dossier.historique || []), historique]
      });
    }
  };

  const removeDocument = (id: string) => {
    const document = documents.find(doc => doc.id === id);
    if (!document) return;
    
    setDocuments(documents.filter(doc => doc.id !== id));
    
    // Add to dossier history
    const dossier = dossiers.find(d => d.id === document.dossierId);
    if (dossier) {
      const historique = createDocumentRemovalHistorique(document);
      updateDossier(document.dossierId, {
        historique: [...(dossier.historique || []), historique]
      });
    }
  };

  const updateDocument = (id: string, data: Partial<DocumentDossier>) => {
    const document = documents.find(doc => doc.id === id);
    if (!document) return;
    
    setDocuments(documents.map(doc => 
      doc.id === id ? { ...doc, ...data } : doc
    ));
    
    // Add to dossier history if status changes
    if (data.status) {
      const dossier = dossiers.find(d => d.id === document.dossierId);
      if (dossier) {
        const historique = createDocumentStatusHistorique(document, data.status);
        if (historique) {
          updateDossier(document.dossierId, {
            historique: [...(dossier.historique || []), historique]
          });
        }
      }
    }
  };

  // Query functions
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
    setNotifications(markAsRead(notifications, id));
  };

  const getUnreadNotificationsCount = () => {
    return countUnreadNotifications(notifications);
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
