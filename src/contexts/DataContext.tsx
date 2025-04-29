
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Dossier, NoteFrais, Inspection, Certificat, Notification, Statistique } from '../types';

interface DataContextProps {
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
  getDossierById: (id: string) => Dossier | undefined;
  getNoteFraisByDossierId: (dossierId: string) => NoteFrais[];
  getInspectionsByDossierId: (dossierId: string) => Inspection[];
  getCertificatByDossierId: (dossierId: string) => Certificat | undefined;
  markNotificationAsRead: (id: string) => void;
  getUnreadNotificationsCount: () => number;
}

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
  getDossierById: () => undefined,
  getNoteFraisByDossierId: () => [],
  getInspectionsByDossierId: () => [],
  getCertificatByDossierId: () => undefined,
  markNotificationAsRead: () => {},
  getUnreadNotificationsCount: () => 0,
});

// Données de démo
const MOCK_DOSSIERS: Dossier[] = [
  {
    id: '1',
    operateurNom: 'Coopérative Agricole du Sud',
    typeProduit: 'Café Bio',
    dateTransmission: '2025-03-15',
    responsable: 'Gestionnaire',
    status: 'en_cours',
    delai: 30,
    dateButoir: '2025-04-15',
  },
  {
    id: '2',
    operateurNom: 'Ferme des Collines',
    typeProduit: 'Huile d\'olive',
    dateTransmission: '2025-02-28',
    responsable: 'Gestionnaire',
    status: 'complet',
    delai: 30,
    dateButoir: '2025-03-30',
  },
  {
    id: '3',
    operateurNom: 'Association des Producteurs de Miel',
    typeProduit: 'Miel',
    dateTransmission: '2025-01-20',
    responsable: 'Gestionnaire',
    status: 'certifie',
    delai: 45,
    dateButoir: '2025-03-06',
  },
  {
    id: '4',
    operateurNom: 'Fromagerie Tradition',
    typeProduit: 'Fromage de Chèvre',
    dateTransmission: '2025-03-05',
    responsable: 'Gestionnaire',
    status: 'en_attente',
    delai: 30,
    dateButoir: '2025-04-05',
  },
];

const MOCK_NOTES_FRAIS: NoteFrais[] = [
  {
    id: '1',
    dossierId: '1',
    inspecteurId: '3',
    dateCreation: '2025-03-20',
    deplacement: 150,
    hebergement: 80,
    restauration: 45,
    indemnites: 70,
    status: 'en_attente',
  },
  {
    id: '2',
    dossierId: '2',
    inspecteurId: '3',
    dateCreation: '2025-03-10',
    deplacement: 90,
    hebergement: 0,
    restauration: 25,
    indemnites: 50,
    status: 'validee',
  },
  {
    id: '3',
    dossierId: '3',
    inspecteurId: '3',
    dateCreation: '2025-02-05',
    deplacement: 210,
    hebergement: 120,
    restauration: 60,
    indemnites: 90,
    status: 'validee',
  },
];

const MOCK_INSPECTIONS: Inspection[] = [
  {
    id: '1',
    dossierId: '1',
    dateInspection: '2025-03-25',
    lieu: 'Saint-Denis',
    inspecteurs: ['Inspecteur'],
    resultat: 'en_attente',
  },
  {
    id: '2',
    dossierId: '2',
    dateInspection: '2025-03-15',
    lieu: 'Fort-de-France',
    inspecteurs: ['Inspecteur'],
    resultat: 'conforme',
    recommandations: 'Maintien des bonnes pratiques',
  },
  {
    id: '3',
    dossierId: '3',
    dateInspection: '2025-02-10',
    lieu: 'Pointe-à-Pitre',
    inspecteurs: ['Inspecteur'],
    resultat: 'conforme',
    recommandations: 'Excellente qualité des produits',
  },
];

const MOCK_CERTIFICATS: Certificat[] = [
  {
    id: '1',
    dossierId: '3',
    numero: 'CERT-2025-001',
    entreprise: 'Association des Producteurs de Miel',
    produit: 'Miel',
    dateDelivrance: '2025-02-15',
    dateExpiration: '2026-02-15',
    status: 'actif',
  },
];

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    userId: '1',
    message: 'Le délai pour le dossier "Coopérative Agricole du Sud" arrive bientôt à expiration',
    type: 'warning',
    lue: false,
    date: '2025-04-10',
    link: '/dossiers/1',
  },
  {
    id: '2',
    userId: '1',
    message: 'La note de frais pour "Ferme des Collines" a été validée',
    type: 'info',
    lue: true,
    date: '2025-03-12',
    link: '/notes-frais/2',
  },
  {
    id: '3',
    userId: '3',
    message: 'Vous avez été assigné à une nouvelle inspection',
    type: 'info',
    lue: false,
    date: '2025-03-20',
    link: '/inspections/1',
  },
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dossiers, setDossiers] = useState<Dossier[]>(MOCK_DOSSIERS);
  const [notesFrais, setNotesFrais] = useState<NoteFrais[]>(MOCK_NOTES_FRAIS);
  const [inspections, setInspections] = useState<Inspection[]>(MOCK_INSPECTIONS);
  const [certificats, setCertificats] = useState<Certificat[]>(MOCK_CERTIFICATS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [statistiques, setStatistiques] = useState<Statistique>({
    totalDossiers: MOCK_DOSSIERS.length,
    dossiersCertifies: MOCK_DOSSIERS.filter(d => d.status === 'certifie').length,
    dossiersEnCours: MOCK_DOSSIERS.filter(d => d.status === 'en_cours' || d.status === 'complet').length,
    dossiersRejetes: MOCK_DOSSIERS.filter(d => d.status === 'rejete').length,
    delaiMoyenTraitement: 25,
  });

  const generateId = () => Math.random().toString(36).substring(2, 11);

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

  const getDossierById = (id: string) => {
    return dossiers.find(dossier => dossier.id === id);
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
    setStatistiques({
      totalDossiers: updatedDossiers.length,
      dossiersCertifies: updatedDossiers.filter(d => d.status === 'certifie').length,
      dossiersEnCours: updatedDossiers.filter(d => d.status === 'en_cours' || d.status === 'complet').length,
      dossiersRejetes: updatedDossiers.filter(d => d.status === 'rejete').length,
      delaiMoyenTraitement: 25, // Fixé pour la démo
    });
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
      getDossierById,
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
