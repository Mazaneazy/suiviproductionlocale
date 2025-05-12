
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  dateCreation?: string;
  phone?: string;
  modules?: string[];
  // Added missing properties used in the application
  password?: string;
  permissions?: string[];
  actions?: UserAction[];
  producteurDossierId?: string;
  // Properties that are used in mockData.ts
  nom?: string;
  prenom?: string;
  telephone?: string;
  avatar?: any;
}

export type UserRole = 
  | 'admin'
  | 'acceuil'
  | 'inspecteur'
  | 'certificats'
  | 'analyste'
  | 'comptable'
  | 'responsable_technique'
  | 'chef_mission'
  | 'surveillant'
  | 'directeur'
  | 'directeur_general'
  | 'gestionnaire'
  | 'producteur'
  | 'responsable_qualite'
  | 'comite_validation'
  | 'directeur_evaluation';

export interface UserAction {
  id: string;
  userId: string;
  action: string;
  date: string;
  details?: string;
  module?: string;
}
