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

// Données de démo pour des entreprises camerounaises
const MOCK_DOSSIERS: Dossier[] = [
  {
    id: '1',
    operateurNom: 'SABC (Société Anonyme des Brasseries du Cameroun)',
    typeProduit: 'Boissons gazeuses',
    dateTransmission: '2025-03-15',
    responsable: 'Gestionnaire',
    status: 'en_cours',
    delai: 30,
    dateButoir: '2025-04-15',
  },
  {
    id: '2',
    operateurNom: 'SOSUCAM (Société Sucrière du Cameroun)',
    typeProduit: 'Sucre raffiné',
    dateTransmission: '2025-02-28',
    responsable: 'Gestionnaire',
    status: 'complet',
    delai: 30,
    dateButoir: '2025-03-30',
  },
  {
    id: '3',
    operateurNom: 'CICAM (Cotonnière Industrielle du Cameroun)',
    typeProduit: 'Textile',
    dateTransmission: '2025-01-20',
    responsable: 'Gestionnaire',
    status: 'certifie',
    delai: 45,
    dateButoir: '2025-03-06',
  },
  {
    id: '4',
    operateurNom: 'CIMENCAM (Cimenteries du Cameroun)',
    typeProduit: 'Ciment',
    dateTransmission: '2025-03-05',
    responsable: 'Gestionnaire',
    status: 'en_attente',
    delai: 30,
    dateButoir: '2025-04-05',
  },
  {
    id: '5',
    operateurNom: 'CHOCOCAM (Chocolaterie et Confiserie du Cameroun)',
    typeProduit: 'Chocolats et confiseries',
    dateTransmission: '2025-03-10',
    responsable: 'Gestionnaire',
    status: 'en_cours',
    delai: 20,
    dateButoir: '2025-03-30',
  },
  {
    id: '6',
    operateurNom: 'ALUCAM (Aluminium du Cameroun)',
    typeProduit: 'Aluminium',
    dateTransmission: '2025-02-15',
    responsable: 'Gestionnaire',
    status: 'en_attente',
    delai: 40,
    dateButoir: '2025-03-27',
  },
  {
    id: '7',
    operateurNom: 'PAMOL Plantations',
    typeProduit: 'Huile de palme',
    dateTransmission: '2025-01-25',
    responsable: 'Gestionnaire',
    status: 'certifie',
    delai: 35,
    dateButoir: '2025-03-01',
  },
  {
    id: '8',
    operateurNom: 'SODECOTON (Société de Développement du Coton)',
    typeProduit: 'Coton',
    dateTransmission: '2025-02-10',
    responsable: 'Gestionnaire',
    status: 'complet',
    delai: 25,
    dateButoir: '2025-03-07',
  },
  {
    id: '9',
    operateurNom: 'SEMC (Société des Eaux Minérales du Cameroun)',
    typeProduit: 'Eau minérale',
    dateTransmission: '2025-03-01',
    responsable: 'Gestionnaire',
    status: 'en_cours',
    delai: 15,
    dateButoir: '2025-03-16',
  },
  {
    id: '10',
    operateurNom: 'MAÏSCAM (Société Maïserie du Cameroun)',
    typeProduit: 'Farine de maïs',
    dateTransmission: '2025-02-20',
    responsable: 'Gestionnaire',
    status: 'en_attente',
    delai: 30,
    dateButoir: '2025-03-22',
  },
];

const MOCK_NOTES_FRAIS: NoteFrais[] = [
  {
    id: '1',
    dossierId: '1',
    inspecteurId: '3',
    dateCreation: '2025-03-20',
    deplacement: 75000,
    hebergement: 40000,
    restauration: 30000,
    indemnites: 50000,
    status: 'en_attente',
  },
  {
    id: '2',
    dossierId: '2',
    inspecteurId: '3',
    dateCreation: '2025-03-10',
    deplacement: 45000,
    hebergement: 0,
    restauration: 15000,
    indemnites: 25000,
    status: 'validee',
  },
  {
    id: '3',
    dossierId: '3',
    inspecteurId: '3',
    dateCreation: '2025-02-05',
    deplacement: 120000,
    hebergement: 60000,
    restauration: 35000,
    indemnites: 45000,
    status: 'validee',
  },
  {
    id: '4',
    dossierId: '5',
    inspecteurId: '3',
    dateCreation: '2025-03-12',
    deplacement: 60000,
    hebergement: 45000,
    restauration: 25000,
    indemnites: 30000,
    status: 'en_attente',
  },
  {
    id: '5',
    dossierId: '7',
    inspecteurId: '3',
    dateCreation: '2025-01-30',
    deplacement: 150000,
    hebergement: 70000,
    restauration: 40000,
    indemnites: 55000,
    status: 'validee',
  },
];

const MOCK_INSPECTIONS: Inspection[] = [
  {
    id: '1',
    dossierId: '1',
    dateInspection: '2025-03-25',
    lieu: 'Douala, Littoral',
    inspecteurs: ['Inspecteur'],
    resultat: 'en_attente',
  },
  {
    id: '2',
    dossierId: '2',
    dateInspection: '2025-03-15',
    lieu: 'Mbandjock, Centre',
    inspecteurs: ['Inspecteur'],
    resultat: 'conforme',
    recommandations: 'Maintien des bonnes pratiques de production',
  },
  {
    id: '3',
    dossierId: '3',
    dateInspection: '2025-02-10',
    lieu: 'Garoua, Nord',
    inspecteurs: ['Inspecteur'],
    resultat: 'conforme',
    recommandations: 'Excellente qualité des tissus',
  },
  {
    id: '4',
    dossierId: '5',
    dateInspection: '2025-03-20',
    lieu: 'Douala, Littoral',
    inspecteurs: ['Inspecteur'],
    resultat: 'en_attente',
  },
  {
    id: '5',
    dossierId: '7',
    dateInspection: '2025-02-05',
    lieu: 'Limbé, Sud-Ouest',
    inspecteurs: ['Inspecteur'],
    resultat: 'conforme',
    recommandations: 'Respect des normes environnementales',
  },
];

const MOCK_CERTIFICATS: Certificat[] = [
  {
    id: '1',
    dossierId: '3',
    numero: 'CERT-2025-001',
    entreprise: 'CICAM (Cotonnière Industrielle du Cameroun)',
    produit: 'Textile',
    dateDelivrance: '2025-02-15',
    dateExpiration: '2026-02-15',
    status: 'actif',
  },
  {
    id: '2',
    dossierId: '7',
    numero: 'CERT-2025-002',
    entreprise: 'PAMOL Plantations',
    produit: 'Huile de palme',
    dateDelivrance: '2025-02-01',
    dateExpiration: '2026-02-01',
    status: 'actif',
  },
];

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    userId: '1',
    message: 'Le délai pour le dossier "SABC" arrive bientôt à expiration',
    type: 'warning',
    lue: false,
    date: '2025-04-10',
    link: '/dossiers/1',
  },
  {
    id: '2',
    userId: '1',
    message: 'La note de frais pour "SOSUCAM" a été validée',
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
  {
    id: '4',
    userId: '1',
    message: 'Note de frais reçue du laboratoire pour CHOCOCAM',
    type: 'info',
    lue: false,
    date: '2025-03-12',
    link: '/notes-frais/4',
  },
  {
    id: '5',
    userId: '2',
    message: 'Contrôle inopiné planifié pour SODECOTON',
    type: 'warning',
    lue: false,
    date: '2025-03-05',
    link: '/inspections/6',
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
