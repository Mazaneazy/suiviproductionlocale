
import { useState } from 'react';
import { Certificat, HistoriqueEvenement } from '../../../types';
import { MOCK_CERTIFICATS } from '../mockData';
import { generateId } from '../utils';

export function useCertificats(updateDossier: (id: string, data: any) => void) {
  const [certificats, setCertificats] = useState<Certificat[]>(MOCK_CERTIFICATS);

  const addCertificat = (certificat: Omit<Certificat, 'id'>) => {
    const newCertificat = { ...certificat, id: generateId() };
    setCertificats([...certificats, newCertificat]);
    
    // Mettre à jour le statut du dossier
    updateDossier(certificat.dossierId, { status: 'certifie' });
    
    // Add to dossier history
    const documentType = newCertificat.numero.startsWith('CERT') 
      ? 'Certificat de conformité'
      : newCertificat.numero.startsWith('NC')
        ? 'Rapport de non-conformité'
        : 'Lettre d\'actions correctives';
        
    const historique: HistoriqueEvenement = {
      id: generateId(),
      dossierId: certificat.dossierId,
      date: new Date().toISOString(),
      action: `${documentType} émis`,
      responsable: 'Responsable des certificats',
      commentaire: `Document ${newCertificat.numero} émis pour ${newCertificat.entreprise}`
    };
    
    updateDossier(certificat.dossierId, {
      historique: [historique] // The updateDossier function will merge with existing historique
    });
  };

  const updateCertificat = (id: string, data: Partial<Certificat>) => {
    const certificat = certificats.find(c => c.id === id);
    if (!certificat) return;
    
    setCertificats(certificats.map(certificat => 
      certificat.id === id ? { ...certificat, ...data } : certificat
    ));
    
    // Add to dossier history if status changes
    if (data.status && data.status !== certificat.status) {
      const documentType = certificat.numero.startsWith('CERT') 
        ? 'Certificat de conformité'
        : certificat.numero.startsWith('NC')
          ? 'Rapport de non-conformité'
          : 'Lettre d\'actions correctives';
          
      const historique: HistoriqueEvenement = {
        id: generateId(),
        dossierId: certificat.dossierId,
        date: new Date().toISOString(),
        action: `Statut du ${documentType} modifié: ${certificat.status} → ${data.status}`,
        responsable: 'Responsable des certificats',
        commentaire: `Statut du document ${certificat.numero} modifié`
      };
      
      updateDossier(certificat.dossierId, {
        historique: [historique] // The updateDossier function will merge with existing historique
      });
    }
  };

  const getCertificatByDossierId = (dossierId: string) => {
    return certificats.find(certificat => certificat.dossierId === dossierId);
  };

  return {
    certificats,
    addCertificat,
    updateCertificat,
    getCertificatByDossierId
  };
}
