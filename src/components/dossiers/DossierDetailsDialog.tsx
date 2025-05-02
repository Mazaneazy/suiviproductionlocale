
import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import refactored components
import DossierHeader from './details/DossierHeader';
import DossierHistoryTab from './details/DossierHistoryTab';
import DossierDocumentsTab from './details/DossierDocumentsTab';
import DossierElementsTab from './details/DossierElementsTab';

interface DossierDetailsDialogProps {
  dossierId: string;
}

const DossierDetailsDialog: React.FC<DossierDetailsDialogProps> = ({ dossierId }) => {
  const { 
    getDossierById, 
    getDocumentsByDossierId, 
    getInspectionsByDossierId,
    getCertificatByDossierId
  } = useData();
  
  const [isOpen, setIsOpen] = useState(false);

  const dossier = getDossierById(dossierId);
  const documents = getDocumentsByDossierId(dossierId);
  const inspections = getInspectionsByDossierId(dossierId);
  const certificat = getCertificatByDossierId(dossierId);

  if (!dossier) return null;
  
  console.log("Documents for dossier", dossierId, ":", documents);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Détails</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Détails du dossier: {dossier.operateurNom}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Informations détaillées sur le dossier {dossier.operateurNom}
          </DialogDescription>
        </DialogHeader>
        
        <DossierHeader dossier={dossier} />
        
        <Tabs defaultValue="historique">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="historique">Historique</TabsTrigger>
            <TabsTrigger value="documents">Pièces jointes</TabsTrigger>
            <TabsTrigger value="elements">Éléments du dossier</TabsTrigger>
          </TabsList>
          
          <TabsContent value="historique" className="h-[400px]">
            <DossierHistoryTab historique={dossier.historique} />
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
      </DialogContent>
    </Dialog>
  );
};

export default DossierDetailsDialog;
