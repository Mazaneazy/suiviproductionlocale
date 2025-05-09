
import { DocumentDossier } from '../../types';

// Mock documents for testing
export const MOCK_DOCUMENTS: DocumentDossier[] = [
  // Dossier 1 documents
  {
    id: 'doc-001',
    dossierId: 'dossier-001',
    nom: 'Registre de commerce',
    type: 'registre_commerce',
    url: 'https://example.com/docs/registre-001.pdf',
    dateUpload: '2023-05-15T10:30:00',
    status: 'valide',
    taille: 1024, // size in KB
    format: 'pdf',
    uploadedBy: 'operateur-001'
  },
  {
    id: 'doc-002',
    dossierId: 'dossier-001',
    nom: 'Carte contribuable',
    type: 'carte_contribuable',
    url: 'https://example.com/docs/carte-001.pdf',
    dateUpload: '2023-05-15T10:35:00',
    status: 'valide',
    taille: 512,
    format: 'pdf',
    uploadedBy: 'operateur-001'
  },
  
  // Dossier 2 documents
  {
    id: 'doc-003',
    dossierId: 'dossier-002',
    nom: 'Processus de production',
    type: 'processus_production',
    url: 'https://example.com/docs/processus-002.pdf',
    dateUpload: '2023-06-02T14:20:00',
    status: 'en_attente',
    taille: 2048,
    format: 'pdf',
    uploadedBy: 'operateur-002'
  },
  {
    id: 'doc-004',
    dossierId: 'dossier-002',
    nom: 'Plan qualité',
    type: 'plan_qualite',
    url: 'https://example.com/docs/plan-002.pdf',
    dateUpload: '2023-06-02T14:25:00',
    status: 'en_attente',
    taille: 1536,
    format: 'pdf',
    uploadedBy: 'operateur-002'
  },
  
  // Dossier 3 documents
  {
    id: 'doc-005',
    dossierId: 'dossier-003',
    nom: 'Registre de commerce',
    type: 'registre_commerce',
    url: 'https://example.com/docs/registre-003.pdf',
    dateUpload: '2023-07-10T09:15:00',
    status: 'valide',
    taille: 768,
    format: 'pdf',
    uploadedBy: 'operateur-003'
  },
  {
    id: 'doc-006',
    dossierId: 'dossier-003',
    nom: 'Certificat d\'origine',
    type: 'certificat_origine',
    url: 'https://example.com/docs/origine-003.pdf',
    dateUpload: '2023-07-10T09:20:00',
    status: 'valide',
    taille: 1024,
    format: 'pdf',
    uploadedBy: 'operateur-003'
  },
  
  // Dossier 4 documents
  {
    id: 'doc-007',
    dossierId: 'dossier-004',
    nom: 'Registre de commerce',
    type: 'registre_commerce',
    url: 'https://example.com/docs/registre-004.pdf',
    dateUpload: '2023-08-05T16:40:00',
    status: 'valide',
    taille: 896,
    format: 'pdf',
    uploadedBy: 'operateur-004'
  },
  {
    id: 'doc-008',
    dossierId: 'dossier-004',
    nom: 'Rapport d\'analyses',
    type: 'rapport_analyses',
    url: 'https://example.com/docs/analyses-004.pdf',
    dateUpload: '2023-08-05T16:45:00',
    status: 'valide',
    taille: 1792,
    format: 'pdf',
    uploadedBy: 'operateur-004'
  },
  
  // Dossier 5 documents
  {
    id: 'doc-009',
    dossierId: 'dossier-005',
    nom: 'Liste du personnel',
    type: 'liste_personnel',
    url: 'https://example.com/docs/personnel-005.pdf',
    dateUpload: '2023-09-12T11:10:00',
    status: 'valide',
    taille: 640,
    format: 'pdf',
    uploadedBy: 'operateur-005'
  }
];
