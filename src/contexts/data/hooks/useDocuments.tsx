
import { useState, useEffect } from 'react';
import { DocumentDossier } from '../../../types';
import { MOCK_DOCUMENTS } from '../mockData';
import { generateId } from '../utils';

export function useDocuments(updateDossier: (id: string, data: any) => void) {
  // Initialize with documents from localStorage if available
  const [documents, setDocuments] = useState<DocumentDossier[]>(() => {
    try {
      const storedDocuments = localStorage.getItem('documents');
      if (storedDocuments) {
        const parsedDocs = JSON.parse(storedDocuments);
        console.log("Documents chargés depuis localStorage:", parsedDocs.length);
        return Array.isArray(parsedDocs) ? parsedDocs : MOCK_DOCUMENTS;
      }
    } catch (error) {
      console.error('Erreur lors du chargement des documents depuis localStorage:', error);
    }
    return MOCK_DOCUMENTS;
  });

  const addDocument = (document: Omit<DocumentDossier, 'id'>) => {
    const newDocument = { ...document, id: generateId() };
    console.log("Ajout d'un nouveau document:", newDocument);
    
    // Add to state
    setDocuments(prevDocuments => {
      const updatedDocuments = [...prevDocuments, newDocument];
      
      // Save to localStorage for persistence
      try {
        localStorage.setItem('documents', JSON.stringify(updatedDocuments));
        console.log(`Document ajouté et sauvegardé, total: ${updatedDocuments.length}`);
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement des documents dans localStorage:', error);
      }
      
      return updatedDocuments;
    });
  };

  const removeDocument = (id: string) => {
    setDocuments(prevDocuments => {
      const updatedDocuments = prevDocuments.filter(doc => doc.id !== id);
      
      // Save to localStorage for persistence
      try {
        localStorage.setItem('documents', JSON.stringify(updatedDocuments));
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement des documents dans localStorage:', error);
      }
      
      return updatedDocuments;
    });
  };

  const updateDocument = (id: string, data: Partial<DocumentDossier>) => {
    setDocuments(prevDocuments => {
      const updatedDocuments = prevDocuments.map(doc => 
        doc.id === id ? { ...doc, ...data } : doc
      );
      
      // Save to localStorage for persistence
      try {
        localStorage.setItem('documents', JSON.stringify(updatedDocuments));
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement des documents dans localStorage:', error);
      }
      
      return updatedDocuments;
    });
  };

  const getDocumentsByDossierId = (dossierId: string) => {
    console.log(`Recherche des documents pour le dossier: ${dossierId}`);
    
    try {
      // Essayer d'abord de charger depuis localStorage pour les données les plus récentes
      const storedDocuments = localStorage.getItem('documents');
      if (storedDocuments) {
        const parsedDocs = JSON.parse(storedDocuments);
        if (Array.isArray(parsedDocs)) {
          const filteredDocs = parsedDocs.filter(doc => doc.dossierId === dossierId);
          console.log(`Trouvé ${filteredDocs.length} documents pour le dossier ${dossierId} dans localStorage`);
          return filteredDocs;
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des documents depuis localStorage:', error);
    }
    
    // Repli sur l'état si localStorage échoue
    const dossierDocuments = documents.filter(doc => doc.dossierId === dossierId);
    console.log(`Trouvé ${dossierDocuments.length} documents pour le dossier ${dossierId} dans l'état`);
    return dossierDocuments;
  };

  // Effet pour synchroniser les documents avec localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const storedDocuments = localStorage.getItem('documents');
        if (storedDocuments) {
          const parsedDocs = JSON.parse(storedDocuments);
          if (Array.isArray(parsedDocs)) {
            setDocuments(parsedDocs);
            console.log("Documents mis à jour depuis localStorage:", parsedDocs.length);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la synchronisation des documents:', error);
      }
    };

    // Écouter les changements de stockage (utile en cas de modifications dans d'autres onglets)
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    documents,
    addDocument,
    removeDocument,
    updateDocument,
    getDocumentsByDossierId,
  };
}
