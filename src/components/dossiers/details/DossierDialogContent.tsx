
import React from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Dossier, DocumentDossier } from '@/types';

// Import refactored components
import DossierHeader from './DossierHeader';
import DossierDetailsTabs from './DossierDetailsTabs';

interface DossierDialogContentProps {
  dossier: Dossier | null;
  documents: DocumentDossier[];
  inspections: any[];
  certificat: any;
  loadingDocuments: boolean;
}

const DossierDialogContent: React.FC<DossierDialogContentProps> = ({
  dossier,
  documents,
  inspections,
  certificat,
  loadingDocuments
}) => {
  if (!dossier) return null;

  return (
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
        isLoading={loadingDocuments}
      />
    </DialogContent>
  );
};

export default DossierDialogContent;
