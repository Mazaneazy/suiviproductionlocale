
import { DocumentDossier } from '../../types';
import { MOCK_DOSSIERS } from './mockDossiers';

// Générer des documents pour les dossiers
export const MOCK_DOCUMENTS: DocumentDossier[] = [];

// Ajouter des documents pour chaque dossier
MOCK_DOSSIERS.forEach(dossier => {
  // Document de base pour tous les dossiers
  MOCK_DOCUMENTS.push({
    id: `doc-rc-${dossier.id}`,
    dossierId: dossier.id,
    nom: 'Registre de Commerce',
    type: 'registre_commerce',
    url: 'https://example.com/docs/registre_commerce.pdf',
    dateUpload: new Date(dossier.dateTransmission).toISOString(),
    status: Math.random() > 0.3 ? 'valide' : 'en_attente'
  });
  
  MOCK_DOCUMENTS.push({
    id: `doc-cc-${dossier.id}`,
    dossierId: dossier.id,
    nom: 'Carte de Contribuable',
    type: 'carte_contribuable',
    url: 'https://example.com/docs/carte_contribuable.pdf',
    dateUpload: new Date(dossier.dateTransmission).toISOString(),
    status: Math.random() > 0.3 ? 'valide' : 'en_attente'
  });
  
  // Documents supplémentaires pour les dossiers plus avancés
  if (['complet', 'rejete', 'certifie'].includes(dossier.status)) {
    MOCK_DOCUMENTS.push({
      id: `doc-pp-${dossier.id}`,
      dossierId: dossier.id,
      nom: 'Schéma du processus de production',
      type: 'processus_production',
      url: 'https://example.com/docs/processus.pdf',
      dateUpload: new Date(new Date(dossier.dateTransmission).getTime() + 5*24*60*60*1000).toISOString(),
      status: Math.random() > 0.2 ? 'valide' : 'en_attente'
    });
    
    MOCK_DOCUMENTS.push({
      id: `doc-pl-${dossier.id}`,
      dossierId: dossier.id,
      nom: 'Plan de localisation',
      type: 'plan_localisation',
      url: 'https://example.com/docs/plan.pdf',
      dateUpload: new Date(new Date(dossier.dateTransmission).getTime() + 5*24*60*60*1000).toISOString(),
      status: Math.random() > 0.2 ? 'valide' : 'en_attente'
    });
    
    // Rapports d'inspection pour les dossiers avec inspection
    if (dossier.status === 'certifie' || dossier.status === 'rejete') {
      MOCK_DOCUMENTS.push({
        id: `doc-ri-${dossier.id}`,
        dossierId: dossier.id,
        nom: 'Rapport d\'inspection',
        type: 'rapport_inspection',
        url: 'https://example.com/docs/rapport_inspection.pdf',
        dateUpload: new Date(new Date(dossier.dateTransmission).getTime() + 15*24*60*60*1000).toISOString(),
        status: 'valide'
      });
      
      MOCK_DOCUMENTS.push({
        id: `doc-ra-${dossier.id}`,
        dossierId: dossier.id,
        nom: 'Rapport d\'analyse',
        type: 'rapport_analyse',
        url: 'https://example.com/docs/rapport_analyse.pdf',
        dateUpload: new Date(new Date(dossier.dateTransmission).getTime() + 18*24*60*60*1000).toISOString(),
        status: 'valide'
      });
      
      // Avis de décision pour les dossiers certifiés ou rejetés
      MOCK_DOCUMENTS.push({
        id: `doc-ad-${dossier.id}`,
        dossierId: dossier.id,
        nom: 'Avis de décision',
        type: 'avis_decision',
        url: 'https://example.com/docs/avis_decision.pdf',
        dateUpload: new Date(new Date(dossier.dateTransmission).getTime() + 22*24*60*60*1000).toISOString(),
        status: 'valide'
      });
      
      // PV comité validation pour les dossiers certifiés ou rejetés
      MOCK_DOCUMENTS.push({
        id: `doc-pv-${dossier.id}`,
        dossierId: dossier.id,
        nom: 'Procès verbal du comité',
        type: 'proces_verbal',
        url: 'https://example.com/docs/pv_comite.pdf',
        dateUpload: new Date(new Date(dossier.dateTransmission).getTime() + 25*24*60*60*1000).toISOString(),
        status: 'valide'
      });
    }
    
    // Certificat pour les dossiers certifiés
    if (dossier.status === 'certifie') {
      MOCK_DOCUMENTS.push({
        id: `doc-cert-${dossier.id}`,
        dossierId: dossier.id,
        nom: 'Certificat de conformité',
        type: 'certificat',
        url: 'https://example.com/docs/certificat.pdf',
        dateUpload: new Date(new Date(dossier.dateTransmission).getTime() + 30*24*60*60*1000).toISOString(),
        status: 'valide'
      });
    }
  }
});
