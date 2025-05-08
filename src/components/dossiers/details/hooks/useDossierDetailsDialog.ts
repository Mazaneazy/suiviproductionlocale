
import { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { DocumentDossier, Dossier } from '@/types';

export function useDossierDetailsDialog(dossierId: string) {
  const { 
    getDossierById, 
    getDocumentsByDossierId, 
    getInspectionsByDossierId,
    getCertificatByDossierId
  } = useData();
  
  const [isOpen, setIsOpen] = useState(false);
  const [documents, setDocuments] = useState<DocumentDossier[]>([]);
  const [inspections, setInspections] = useState([]);
  const [certificat, setCertificat] = useState(null);
  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  // Load data when dialog is opened
  useEffect(() => {
    if (isOpen && dossierId) {
      const loadData = async () => {
        setLoadingDocuments(true);
        
        try {
          const currentDossier = getDossierById(dossierId);
          setDossier(currentDossier);
          
          // Try to load documents from localStorage first
          let currentDocuments = [];
          try {
            const storedDocuments = localStorage.getItem('documents');
            if (storedDocuments) {
              const allDocuments = JSON.parse(storedDocuments);
              if (Array.isArray(allDocuments)) {
                currentDocuments = allDocuments.filter(doc => doc.dossierId === dossierId);
                console.log(`Documents found in localStorage for ${dossierId}:`, currentDocuments.length);
              }
            }
          } catch (error) {
            console.error("Error reading documents from localStorage:", error);
          }
          
          // If no documents found in localStorage, use context function
          if (currentDocuments.length === 0) {
            currentDocuments = getDocumentsByDossierId(dossierId);
            console.log(`Documents retrieved via getDocumentsByDossierId for ${dossierId}:`, currentDocuments.length);
          }
          
          // Load inspections and certificates
          const currentInspections = getInspectionsByDossierId(dossierId);
          const currentCertificat = getCertificatByDossierId(dossierId);

          console.log(`Dialog opened - Documents loaded for ${dossierId}:`, currentDocuments.length);
          
          setDocuments(currentDocuments);
          setInspections(currentInspections);
          setCertificat(currentCertificat);
        } catch (error) {
          console.error("Error loading dossier data:", error);
        } finally {
          setLoadingDocuments(false);
        }
      };

      loadData();
    }
  }, [isOpen, dossierId, getDossierById, getDocumentsByDossierId, getInspectionsByDossierId, getCertificatByDossierId]);

  // Event listener for document updates
  useEffect(() => {
    if (isOpen && dossierId) {
      const handleDocumentsUpdated = (event: CustomEvent) => {
        if (event.detail && event.detail.dossierId === dossierId) {
          console.log("Document update event detected in dialog:", dossierId);
          
          // Re-fetch documents
          try {
            // Try localStorage first
            const storedDocuments = localStorage.getItem('documents');
            if (storedDocuments) {
              const allDocuments = JSON.parse(storedDocuments);
              if (Array.isArray(allDocuments)) {
                const updatedDocs = allDocuments.filter(doc => doc.dossierId === dossierId);
                console.log("Updated documents found in localStorage:", updatedDocs.length);
                setDocuments(updatedDocs);
                return;
              }
            }
            
            // Fall back to context function
            const refreshedDocs = getDocumentsByDossierId(dossierId);
            console.log("Documents refreshed via context:", refreshedDocs.length);
            setDocuments(refreshedDocs);
          } catch (error) {
            console.error("Error refreshing documents:", error);
          }
        }
      };
      
      window.addEventListener('documents-updated', handleDocumentsUpdated as EventListener);
      
      return () => {
        window.removeEventListener('documents-updated', handleDocumentsUpdated as EventListener);
      };
    }
  }, [isOpen, dossierId, getDocumentsByDossierId]);

  return {
    isOpen,
    setIsOpen,
    dossier,
    documents,
    inspections,
    certificat,
    loadingDocuments
  };
}
