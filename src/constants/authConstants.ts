
import { UserRole } from '@/types';

// Define role to permission mapping
export const rolePermissionsMap: Record<UserRole, string[]> = {
  'admin': ['*'], // Admin access to all modules
  'acceuil': ['acceuil', 'dossiers'], // Added access to dossiers for status viewing
  'inspecteur': ['inspections', 'notes-frais'], // Renamed to "Responsable des missions" - added notes-frais access
  'certificats': ['resultats'],
  'analyste': ['statistiques'],
  'comptable': ['notes-frais'],
  'responsable_technique': ['responsable-technique'],
  'chef_mission': ['inspections'],
  'surveillant': ['inspections'],
  'directeur': ['resultats'],
  'directeur_general': ['*'], // Director general access to all modules
  'gestionnaire': ['dossiers'],
  'producteur': ['dashboard'], // Producteurs can only access their dashboard
  'responsable_qualite': ['certificates-creation'], // Added new role for quality manager
  'comite_validation': ['validation'] // Added new role for validation committee
};

// Module names for navigation and access control
export const moduleNames = {
  'acceuil': 'Chargé de clientèle',
  'dossiers': 'Gestion des Dossiers',
  'inspections': 'Inspections',
  'resultats': 'Certificats émis',
  'statistiques': 'Statistiques',
  'notes-frais': 'Notes de frais',
  'responsable-technique': 'Responsable Technique',
  'user-management': 'Gestion des utilisateurs',
  'certificates-creation': 'Montage des Certificats',
  'validation': 'Comité de Validation'
};
