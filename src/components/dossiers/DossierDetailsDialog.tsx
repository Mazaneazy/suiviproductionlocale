
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

// Import refactored components
import DossierHeader from './details/DossierHeader';
import DossierDetailsTabs from './details/DossierDetailsTabs';

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
          <DialogDescription className="text-gray-500">
            Informations détaillées sur le dossier {dossier.operateurNom}
          </DialogDescription>
        </DialogHeader>
        
        <DossierHeader dossier={dossier} />
        
        <DossierDetailsTabs 
          dossier={dossier}
          documents={documents}
          inspections={inspections}
          certificat={certificat}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DossierDetailsDialog;
