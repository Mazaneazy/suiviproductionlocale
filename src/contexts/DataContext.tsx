
import React, { createContext, useState, useContext } from 'react';
import { Dossier, NoteFrais, Inspection, Certificat, Notification, Statistique, DocumentDossier, HistoriqueEvenement, ResultatConformite } from '../types';
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
    const newDossier = { 
      ...dossier, 
      id: generateId(),
      historique: [
        {
          id: generateId(),
          dossierId: '',  // Will be updated below
          date: new Date().toISOString(),
          action: 'Création du dossier',
          responsable: dossier.responsable || 'Système',
          commentaire: 'Dossier créé dans le système'
        }
      ] 
    };
    
    // Set the correct dossierId in the historique
    if (newDossier.historique) {
      newDossier.historique[0].dossierId = newDossier.id;
    }
    
    const updatedDossiers = [...dossiers, newDossier];
    setDossiers(updatedDossiers);
    updateStatistiques(updatedDossiers);
  };

  const updateDossier = (id: string, data: Partial<Dossier>) => {
    const dossier = dossiers.find(d => d.id === id);
    if (!dossier) return;

    // Create historique event if status changes
    if (data.status && data.status !== dossier.status) {
      const historique: HistoriqueEvenement = {
        id: generateId(),
        dossierId: id,
        date: new Date().toISOString(),
        action: `Statut modifié: ${dossier.status} → ${data.status}`,
        responsable: data.responsable || 'Système',
      };
      
      data.historique = [...(dossier.historique || []), historique];
    }
    
    const updated = dossiers.map(dossier => 
      dossier.id === id ? { ...dossier, ...data } : dossier
    );
    setDossiers(updated);
    updateStatistiques(updated);
  };

  const addNoteFrais = (noteFrais: Omit<NoteFrais, 'id'>) => {
    const newNoteFrais = { ...noteFrais, id: generateId() };
    setNotesFrais([...notesFrais, newNoteFrais]);
    
    // Add to dossier history
    const dossier = dossiers.find(d => d.id === noteFrais.dossierId);
    if (dossier) {
      const historique: HistoriqueEvenement = {
        id: generateId(),
        dossierId: noteFrais.dossierId,
        date: new Date().toISOString(),
        action: 'Note de frais créée',
        responsable: noteFrais.inspecteurId,
        commentaire: `Note de frais pour un montant total de ${noteFrais.total || 0} FCFA`
      };
      
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

  const addInspection = (inspection: Omit<Inspection, 'id'>) => {
    const newInspection = { ...inspection, id: generateId() };
    setInspections([...inspections, newInspection]);
    
    // Add to dossier history
    const dossier = dossiers.find(d => d.id === inspection.dossierId);
    if (dossier) {
      const historique: HistoriqueEvenement = {
        id: generateId(),
        dossierId: inspection.dossierId,
        date: new Date().toISOString(),
        action: 'Inspection programmée',
        responsable: inspection.inspecteurs[0] || 'Système',
        commentaire: `Inspection programmée pour le ${new Date(inspection.dateInspection).toLocaleDateString()}`
      };
      
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
    if (data.resultat && data.resultat !== inspection.resultat) {
      const dossier = dossiers.find(d => d.id === inspection.dossierId);
      if (dossier) {
        const historique: HistoriqueEvenement = {
          id: generateId(),
          dossierId: inspection.dossierId,
          date: new Date().toISOString(),
          action: `Résultat d'inspection: ${data.resultat}`,
          responsable: inspection.inspecteurs[0] || 'Inspecteur',
          commentaire: data.resultat === 'conforme' 
            ? 'Inspection validée comme conforme'
            : data.resultat === 'non_conforme'
              ? 'Inspection validée comme non conforme'
              : 'Statut d\'inspection mis à jour'
        };
        
        updateDossier(inspection.dossierId, {
          historique: [...(dossier.historique || []), historique]
        });
      }
    }
  };

  const addCertificat = (certificat: Omit<Certificat, 'id'>) => {
    const newCertificat = { ...certificat, id: generateId() };
    setCertificats([...certificats, newCertificat]);
    
    // Mettre à jour le statut du dossier
    updateDossier(certificat.dossierId, { status: 'certifie' });
    
    // Add to dossier history
    const dossier = dossiers.find(d => d.id === certificat.dossierId);
    if (dossier) {
      const documentType = newCertificat.numero.startsWith('CERT') 
        ? 'Certificat de conformité'
        : newCertificat.numero.startsWith('NC')
          ? 'Rapport de non-conformité'
          : 'Lettre d\'actions correctives';
          
      const historique: HistoriqueEvenement = {
        id: generateId(),
        dossierId: certificat.dossierId,
        date: new Date().toISOString(),
        action: `${documentType} émis`,
        responsable: 'Responsable des certificats',
        commentaire: `Document ${newCertificat.numero} émis pour ${newCertificat.entreprise}`
      };
      
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
    if (data.status && data.status !== certificat.status) {
      const dossier = dossiers.find(d => d.id === certificat.dossierId);
      if (dossier) {
        const documentType = certificat.numero.startsWith('CERT') 
          ? 'Certificat de conformité'
          : certificat.numero.startsWith('NC')
            ? 'Rapport de non-conformité'
            : 'Lettre d\'actions correctives';
            
        const historique: HistoriqueEvenement = {
          id: generateId(),
          dossierId: certificat.dossierId,
          date: new Date().toISOString(),
          action: `Statut du ${documentType} modifié: ${certificat.status} → ${data.status}`,
          responsable: 'Responsable des certificats',
          commentaire: `Statut du document ${certificat.numero} modifié`
        };
        
        updateDossier(certificat.dossierId, {
          historique: [...(dossier.historique || []), historique]
        });
      }
    }
  };

  const addDocument = (document: Omit<DocumentDossier, 'id'>) => {
    // Explicitly set the status to 'en_attente' as a valid DocumentDossier status
    const newDocument = { 
      ...document, 
      id: generateId(), 
      status: 'en_attente' as 'valide' | 'rejete' | 'en_attente'
    };
    
    setDocuments([...documents, newDocument]);
    
    // Add to dossier history
    const dossier = dossiers.find(d => d.id === document.dossierId);
    if (dossier) {
      const historique: HistoriqueEvenement = {
        id: generateId(),
        dossierId: document.dossierId,
        date: new Date().toISOString(),
        action: 'Document ajouté',
        responsable: 'Utilisateur',
        commentaire: `Document "${document.nom}" ajouté au dossier`
      };
      
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
      const historique: HistoriqueEvenement = {
        id: generateId(),
        dossierId: document.dossierId,
        date: new Date().toISOString(),
        action: 'Document supprimé',
        responsable: 'Utilisateur',
        commentaire: `Document "${document.nom}" supprimé du dossier`
      };
      
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
    if (data.status && data.status !== document.status) {
      const dossier = dossiers.find(d => d.id === document.dossierId);
      if (dossier) {
        const historique: HistoriqueEvenement = {
          id: generateId(),
          dossierId: document.dossierId,
          date: new Date().toISOString(),
          action: `Statut du document modifié: ${document.status || 'non défini'} → ${data.status}`,
          responsable: 'Utilisateur',
          commentaire: `Statut du document "${document.nom}" modifié`
        };
        
        updateDossier(document.dossierId, {
          historique: [...(dossier.historique || []), historique]
        });
      }
    }
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
