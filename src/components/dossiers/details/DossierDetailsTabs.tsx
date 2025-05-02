
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dossier, DocumentDossier } from '@/types';

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
  documents, 
  inspections, 
  certificat 
}) => {
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
        <DossierDocumentsTab documents={documents} />
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
