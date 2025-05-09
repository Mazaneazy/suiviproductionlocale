
export interface ComiteTechnique {
  id: string;
  dossierId: string;
  dateCreation: string;
  chefComite: MembreComite;
  membres: MembreComite[];
}

export interface MembreComite {
  id: string;
  nom: string;
  role: 'chef' | 'inspecteur' | 'analyste' | 'expert';
  specialite?: string;
}
