
import { useState } from 'react';
import { DocumentDossier } from '../../../types';
import { MOCK_DOCUMENTS } from '../mockData';
import { generateId } from '../utils';

export function useDocuments(updateDossier: (id: string, data: any) => void) {
  // Initialize with mock documents
  const [documents, setDocuments] = useState<DocumentDossier[]>(MOCK_DOCUMENTS);

  const addDocument = (document: Omit<DocumentDossier, 'id'>) => {
    const newDocument = { ...document, id: generateId() };
    
    // Add to state
    setDocuments(prevDocuments => {
      const updatedDocuments = [...prevDocuments, newDocument];
      
      // Save to localStorage for persistence
      try {
        localStorage.setItem('documents', JSON.stringify(updatedDocuments));
      } catch (error) {
        console.error('Error saving documents to localStorage:', error);
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
        console.error('Error saving documents to localStorage:', error);
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
        console.error('Error saving documents to localStorage:', error);
      }
      
      return updatedDocuments;
    });
  };

  const getDocumentsByDossierId = (dossierId: string) => {
    // Try to load from localStorage first for the most recent data
    try {
      const storedDocuments = JSON.parse(localStorage.getItem('documents') || '[]');
      if (Array.isArray(storedDocuments) && storedDocuments.length > 0) {
        const dossiersDocuments = storedDocuments.filter((doc: DocumentDossier) => doc.dossierId === dossierId);
        console.log(`Found ${dossiersDocuments.length} documents for dossier ${dossierId} in localStorage`);
        return dossiersDocuments;
      }
    } catch (error) {
      console.error('Error loading documents from localStorage:', error);
    }
    
    // Fallback to state if localStorage fails
    const dossiersDocuments = documents.filter(doc => doc.dossierId === dossierId);
    console.log(`Found ${dossiersDocuments.length} documents for dossier ${dossierId} in state`);
    return dossiersDocuments;
  };

  return {
    documents,
    addDocument,
    removeDocument,
    updateDocument,
    getDocumentsByDossierId,
  };
}
