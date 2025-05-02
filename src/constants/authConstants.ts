
import { UserRole } from '@/types';

// Define role to permission mapping
export const rolePermissionsMap: Record<UserRole, string[]> = {
  'admin': ['*'], // Admin access to all modules
  'acceuil': ['acceuil'],
  'inspecteur': ['inspections'],
  'certificats': ['resultats'],
  'analyste': ['statistiques'],
  'comptable': ['notes-frais'],
  'responsable_technique': ['responsable-technique'],
  'chef_mission': ['inspections'],
  'surveillant': ['inspections'],
  'directeur': ['resultats'],
  'directeur_general': ['*'], // Director general access to all modules
  'gestionnaire': ['dossiers'],
  'producteur': ['dashboard'] // Producteurs can only access their dashboard
};

// Module names for navigation and access control
export const moduleNames = {
  'acceuil': 'Poste d\'Accueil',
  'dossiers': 'Gestion des Dossiers',
  'inspections': 'Inspections',
  'resultats': 'Certificats émis',
  'statistiques': 'Statistiques',
  'notes-frais': 'Notes de frais',
  'responsable-technique': 'Responsable Technique',
  'user-management': 'Gestion des utilisateurs'
};
