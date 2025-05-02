
import React, { useState, useEffect } from 'react';
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
  const [documents, setDocuments] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [certificat, setCertificat] = useState(null);
  const [dossier, setDossier] = useState(null);

  // Charger les données lorsque le dialogue est ouvert
  useEffect(() => {
    if (isOpen && dossierId) {
      const loadData = () => {
        const currentDossier = getDossierById(dossierId);
        const currentDocuments = getDocumentsByDossierId(dossierId);
        const currentInspections = getInspectionsByDossierId(dossierId);
        const currentCertificat = getCertificatByDossierId(dossierId);

        console.log(`Dialogue ouvert - Chargement des documents pour ${dossierId}:`, currentDocuments);
        
        setDossier(currentDossier);
        setDocuments(currentDocuments);
        setInspections(currentInspections);
        setCertificat(currentCertificat);
      };

      loadData();
      
      // Ajouter un petit délai pour permettre aux documents d'être ajoutés si nécessaire
      const refreshTimer = setTimeout(loadData, 1000);
      
      return () => clearTimeout(refreshTimer);
    }
  }, [isOpen, dossierId, getDossierById, getDocumentsByDossierId, getInspectionsByDossierId, getCertificatByDossierId]);

  if (!dossierId) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Détails</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Détails du dossier: {dossier?.operateurNom}
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Informations détaillées sur le dossier {dossier?.operateurNom}
          </DialogDescription>
        </DialogHeader>
        
        {dossier && <DossierHeader dossier={dossier} />}
        
        {dossier && (
          <DossierDetailsTabs 
            dossier={dossier}
            documents={documents}
            inspections={inspections}
            certificat={certificat}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DossierDetailsDialog;
