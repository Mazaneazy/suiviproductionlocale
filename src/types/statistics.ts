
export interface Statistique {
  totalDossiers: number;
  dossiersCertifies: number;
  dossiersEnCours: number;
  dossiersRejetes: number;
  inspectionsRealisees: number;
  tauxConformite: number;
  fraisPercus: number;
  dossiersParStatus: {
    en_attente: number;
    en_cours: number;
    complet: number;
    rejete: number;
    certifie: number;
    a_corriger: number;
  };
  certificationParMois: {
    mois: string;
    nombre: number;
  }[];
}
