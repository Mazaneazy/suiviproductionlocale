
import { useState } from 'react';
import { DocumentDossier } from '../../../types';
import { MOCK_DOCUMENTS } from '../mockData';
import { generateId } from '../utils';

export function useDocuments(updateDossier: (id: string, data: any) => void) {
  // Initialize with mock documents
  const [documents, setDocuments] = useState<DocumentDossier[]>(MOCK_DOCUMENTS);

  const addDocument = (document: Omit<DocumentDossier, 'id'>) => {
    const newDocument = { ...document, id: generateId() };
    setDocuments(prevDocuments => [...prevDocuments, newDocument]);
  };

  const removeDocument = (id: string) => {
    setDocuments(prevDocuments => prevDocuments.filter(doc => doc.id !== id));
  };

  const updateDocument = (id: string, data: Partial<DocumentDossier>) => {
    setDocuments(prevDocuments =>
      prevDocuments.map(doc => (doc.id === id ? { ...doc, ...data } : doc))
    );
  };

  const getDocumentsByDossierId = (dossierId: string) => {
    const dossiersDocuments = documents.filter(doc => doc.dossierId === dossierId);
    console.log(`Found ${dossiersDocuments.length} documents for dossier ${dossierId}`);
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
