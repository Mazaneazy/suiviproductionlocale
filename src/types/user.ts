
export type UserRole = 'admin' | 'acceuil' | 'inspecteur' | 'certificats' | 'analyste' | 'comptable' | 'responsable_technique' | 'chef_mission' | 'surveillant' | 'directeur' | 'directeur_general' | 'gestionnaire' | 'producteur' | 'responsable_qualite' | 'comite_validation';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  password?: string;
  permissions?: string[];
  actions?: UserAction[];
  producteurDossierId?: string;
}

export interface UserAction {
  id: string;
  userId: string;
  date: string;
  action: string;
  details: string;
  module: string;
}
