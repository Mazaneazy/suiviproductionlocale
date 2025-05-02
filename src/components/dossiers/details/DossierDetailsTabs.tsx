
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dossier, DocumentDossier } from '@/types';
import { useData } from '@/contexts/DataContext';

// Import tab content components
import DossierHistoryTab from './DossierHistoryTab';
import DossierDocumentsTab from './DossierDocumentsTab';
import DossierElementsTab from './DossierElementsTab';

interface DossierDetailsTabsProps {
  dossier: Dossier;
  documents: DocumentDossier[];
  inspections: any[];
  certificat: any;
}

const DossierDetailsTabs: React.FC<DossierDetailsTabsProps> = ({ 
  dossier, 
  documents: initialDocuments, 
  inspections, 
  certificat 
}) => {
  const { getDocumentsByDossierId } = useData();
  const [documents, setDocuments] = useState<DocumentDossier[]>(initialDocuments || []);
  
  // Rafraîchir les documents chaque fois que le dossier change ou que le composant est monté
  useEffect(() => {
    if (dossier && dossier.id) {
      console.log(`Rafraîchissement des documents pour le dossier: ${dossier.id}`);
      
      try {
        // Essayer d'obtenir les documents directement depuis localStorage pour les données les plus récentes
        const storedDocuments = localStorage.getItem('documents');
        if (storedDocuments) {
          const allDocuments = JSON.parse(storedDocuments);
          if (Array.isArray(allDocuments)) {
            const dossiersDocuments = allDocuments.filter(doc => doc.dossierId === dossier.id);
            console.log("Documents trouvés dans localStorage:", dossiersDocuments.length);
            if (dossiersDocuments.length > 0) {
              setDocuments(dossiersDocuments);
              return;
            }
          }
        }
      } catch (error) {
        console.error("Erreur lors de l'accès aux documents dans localStorage:", error);
      }
      
      // Si localStorage échoue ou ne contient pas de documents pour ce dossier, utiliser getDocumentsByDossierId
      const refreshedDocs = getDocumentsByDossierId(dossier.id);
      console.log("Documents rafraîchis via getDocumentsByDossierId:", refreshedDocs);
      setDocuments(refreshedDocs || []);
    }
  }, [dossier, getDocumentsByDossierId]);
  
  // Ajouter un écouteur d'événements pour les mises à jour de documents
  useEffect(() => {
    const handleDocumentsUpdated = (event: CustomEvent) => {
      if (event.detail && event.detail.dossierId === dossier.id) {
        console.log("Événement de mise à jour de documents détecté pour le dossier:", dossier.id);
        
        // Rafraîchir les documents depuis localStorage
        try {
          const storedDocuments = localStorage.getItem('documents');
          if (storedDocuments) {
            const allDocuments = JSON.parse(storedDocuments);
            if (Array.isArray(allDocuments)) {
              const dossiersDocuments = allDocuments.filter(doc => doc.dossierId === dossier.id);
              console.log("Documents mis à jour trouvés dans localStorage:", dossiersDocuments.length);
              setDocuments(dossiersDocuments);
            }
          }
        } catch (error) {
          console.error("Erreur lors de l'accès aux documents mis à jour dans localStorage:", error);
        }
      }
    };
    
    // Ajouter l'écouteur d'événements
    window.addEventListener('documents-updated', handleDocumentsUpdated as EventListener);
    
    // Nettoyer l'écouteur lors du démontage
    return () => {
      window.removeEventListener('documents-updated', handleDocumentsUpdated as EventListener);
    };
  }, [dossier]);
  
  console.log("Documents actuellement dans DossierDetailsTabs:", documents);
  
  return (
    <Tabs defaultValue="historique">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="historique">Historique</TabsTrigger>
        <TabsTrigger value="documents">Pièces jointes</TabsTrigger>
        <TabsTrigger value="elements">Éléments du dossier</TabsTrigger>
      </TabsList>
      
      <TabsContent value="historique" className="h-[400px]">
        <DossierHistoryTab historique={dossier.historique || []} />
      </TabsContent>
      
      <TabsContent value="documents" className="h-[400px]">
        <DossierDocumentsTab documents={documents || []} />
      </TabsContent>
      
      <TabsContent value="elements" className="h-[400px]">
        <DossierElementsTab 
          dossier={dossier} 
          inspections={inspections} 
          certificat={certificat}
        />
      </TabsContent>
    </Tabs>
  );
};

export default DossierDetailsTabs;
