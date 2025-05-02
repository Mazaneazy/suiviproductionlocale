
import { Certificat, HistoriqueEvenement } from '../../../types';
import { generateId } from '../utils';

export const createCertificat = (certificat: Omit<Certificat, 'id'>) => {
  return { ...certificat, id: generateId() };
};

export const determineCertificatType = (numero: string): string => {
  return numero.startsWith('CERT') 
    ? 'Certificat de conformité'
    : numero.startsWith('NC')
      ? 'Rapport de non-conformité'
      : 'Lettre d\'actions correctives';
};

export const createCertificatHistorique = (certificat: Certificat): HistoriqueEvenement => {
  const documentType = determineCertificatType(certificat.numero);
  
  return {
    id: generateId(),
    dossierId: certificat.dossierId,
    date: new Date().toISOString(),
    action: `${documentType} émis`,
    responsable: 'Responsable des certificats',
    commentaire: `Document ${certificat.numero} émis pour ${certificat.entreprise}`
  };
};

export const createCertificatStatusHistorique = (
  certificat: Certificat, 
  newStatus: string
): HistoriqueEvenement | undefined => {
  if (newStatus && newStatus !== certificat.status) {
    const documentType = determineCertificatType(certificat.numero);
    
    return {
      id: generateId(),
      dossierId: certificat.dossierId,
      date: new Date().toISOString(),
      action: `Statut du ${documentType} modifié: ${certificat.status} → ${newStatus}`,
      responsable: 'Responsable des certificats',
      commentaire: `Statut du document ${certificat.numero} modifié`
    };
  }
  
  return undefined;
};
