
import { UserRole } from '../types';

// Define role to permission mapping
export const rolePermissionsMap: Record<UserRole, string[]> = {
  'admin': ['*'], // Admin access to all modules
  'acceuil': ['acceuil', 'dossiers', 'dashboard'], // Added access to dashboard for "Chargé de clientèle"
  'inspecteur': ['inspections', 'notes-frais', 'dashboard'], // Added dashboard access
  'certificats': ['resultats', 'dossiers', 'dashboard'], // Added dashboard access
  'analyste': ['statistiques', 'dossiers', 'dashboard'], // Added dashboard access
  'comptable': ['notes-frais', 'dossiers', 'dashboard'], // Added dashboard access
  'responsable_technique': ['responsable-technique', 'dossiers', 'dashboard'], // Added dashboard access
  'chef_mission': ['inspections', 'dossiers', 'dashboard'], // Added dashboard access
  'surveillant': ['inspections', 'dossiers', 'dashboard'], // Added dashboard access
  'directeur': ['resultats', 'dossiers', 'dashboard'], // Added dashboard access
  'directeur_general': ['*'], // Director general access to all modules
  'gestionnaire': ['dossiers', 'dashboard'], // Added dashboard access
  'producteur': ['dashboard', 'dossiers'], // Already had dashboard access
  'responsable_qualite': ['certificates-creation', 'dossiers', 'dashboard'], // Added dashboard access
  'comite_validation': ['validation', 'dossiers', 'dashboard'] // Added dashboard access
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
  'validation': 'Comité de Validation',
  'dashboard': 'Tableau de bord'
};
