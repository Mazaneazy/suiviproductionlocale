
import { DocumentUpload } from '../components/acceuil/DocumentsSection';

// Cette fonction retourne la liste des documents obligatoires et optionnels pour une demande de certification
export const getDefaultDocumentsList = (): DocumentUpload[] => {
  return [
    {
      type: 'registre_commerce',
      file: null,
      label: 'Registre de Commerce (RCCM)',
      required: true
    },
    {
      type: 'carte_contribuable',
      file: null,
      label: 'Carte de contribuable (NIU)',
      required: true
    },
    {
      type: 'processus_production',
      file: null,
      label: 'Schéma du processus de fabrication',
      required: true
    },
    {
      type: 'certificats_conformite',
      file: null,
      label: 'Certificat de conformité de la matière première',
      required: false
    },
    {
      type: 'liste_personnel',
      file: null,
      label: 'Liste du personnel (sur papier entête)',
      required: true
    },
    {
      type: 'plan_localisation',
      file: null,
      label: 'Liste des produits à certifier',
      required: true
    }
  ];
};

// Cette fonction détermine le type de document en fonction du nom de fichier
export const determineDocumentType = (fileName: string): string => {
  fileName = fileName.toLowerCase();
  
  if (fileName.includes('rccm') || fileName.includes('registre') || fileName.includes('commerce')) {
    return 'registre_commerce';
  }
  
  if (fileName.includes('niu') || fileName.includes('contribuable')) {
    return 'carte_contribuable';
  }
  
  if (fileName.includes('process') || fileName.includes('fabrication') || fileName.includes('production')) {
    return 'processus_production';
  }
  
  if (fileName.includes('conform') || fileName.includes('matiere') || fileName.includes('primaire')) {
    return 'certificats_conformite';
  }
  
  if (fileName.includes('personnel') || fileName.includes('staff')) {
    return 'liste_personnel';
  }
  
  if (fileName.includes('produits') || fileName.includes('products') || fileName.includes('certifier')) {
    return 'plan_localisation';
  }
  
  // Par défaut, retourner 'pdf' comme type générique
  return 'pdf';
};
