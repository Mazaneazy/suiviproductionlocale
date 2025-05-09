
import { Certificat } from '../../types';
import { MOCK_DOSSIERS } from './mockDossiers';

// Générer des certificats pour les dossiers certifiés
export const MOCK_CERTIFICATS: Certificat[] = MOCK_DOSSIERS
  .filter(dossier => dossier.status === 'certifie')
  .map((dossier, index) => {
    const dateDelivrance = new Date(new Date(dossier.dateTransmission).getTime() + 30*24*60*60*1000).toISOString();
    const dateExpiration = new Date(new Date(dateDelivrance).getTime() + 365*24*60*60*1000).toISOString();
    
    return {
      id: `certificat-${index+1}`,
      dossierId: dossier.id,
      numero: `CERT-${new Date().getFullYear()}-${(index+1).toString().padStart(3, '0')}`,
      dateDelivrance,
      dateExpiration,
      entreprise: dossier.operateurNom,
      produit: dossier.typeProduit,
      status: 'actif',
      responsableQualiteId: `resp-qual-${index % 3 + 1}`,
      resultatConformite: {
        id: `res-conf-${index+1}`,
        certificatId: `certificat-${index+1}`,
        dateEvaluation: new Date(new Date(dossier.dateTransmission).getTime() + 25*24*60*60*1000).toISOString(),
        conclusion: `Le produit ${dossier.typeProduit} est conforme aux normes camerounaises applicables.`,
        rapport: `Rapport d'évaluation de conformité - ${dossier.operateurNom}`
      }
    };
  });
