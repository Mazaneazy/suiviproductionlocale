
import { useState, useEffect } from 'react';
import { DocumentDossier, HistoriqueEvenement } from '../../../types';
import { generateId } from '../utils';
import { MOCK_DOCUMENTS } from '../mockData';

export function useDocuments(updateDossier: (id: string, data: any) => void) {
  // Initialize with mock data for demonstration
  const [documents, setDocuments] = useState<DocumentDossier[]>(MOCK_DOCUMENTS);

  const addDocument = (document: Omit<DocumentDossier, 'id'>) => {
    // Explicitly set the status to 'en_attente' as a valid DocumentDossier status
    const newDocument = { 
      ...document, 
      id: generateId(), 
      status: 'en_attente' as 'valide' | 'rejete' | 'en_attente'
    };
    
    setDocuments([...documents, newDocument]);
    
    // Add to dossier history
    const historique: HistoriqueEvenement = {
      id: generateId(),
      dossierId: document.dossierId,
      date: new Date().toISOString(),
      action: 'Document ajouté',
      responsable: 'Utilisateur',
      commentaire: `Document "${document.nom}" ajouté au dossier`
    };
    
    updateDossier(document.dossierId, {
      historique: [historique] // The updateDossier function will merge with existing historique
    });
  };

  const removeDocument = (id: string) => {
    const document = documents.find(doc => doc.id === id);
    if (!document) return;
    
    setDocuments(documents.filter(doc => doc.id !== id));
    
    // Add to dossier history
    const historique: HistoriqueEvenement = {
      id: generateId(),
      dossierId: document.dossierId,
      date: new Date().toISOString(),
      action: 'Document supprimé',
      responsable: 'Utilisateur',
      commentaire: `Document "${document.nom}" supprimé du dossier`
    };
    
    updateDossier(document.dossierId, {
      historique: [historique] // The updateDossier function will merge with existing historique
    });
  };

  const updateDocument = (id: string, data: Partial<DocumentDossier>) => {
    const document = documents.find(doc => doc.id === id);
    if (!document) return;
    
    setDocuments(documents.map(doc => 
      doc.id === id ? { ...doc, ...data } : doc
    ));
    
    // Add to dossier history if status changes
    if (data.status && data.status !== document.status) {
      const historique: HistoriqueEvenement = {
        id: generateId(),
        dossierId: document.dossierId,
        date: new Date().toISOString(),
        action: `Statut du document modifié: ${document.status || 'non défini'} → ${data.status}`,
        responsable: 'Utilisateur',
        commentaire: `Statut du document "${document.nom}" modifié`
      };
      
      updateDossier(document.dossierId, {
        historique: [historique] // The updateDossier function will merge with existing historique
      });
    }
  };

  const getDocumentsByDossierId = (dossierId: string) => {
    return documents.filter(doc => doc.dossierId === dossierId);
  };

  return {
    documents,
    addDocument,
    removeDocument,
    updateDocument,
    getDocumentsByDossierId
  };
}
