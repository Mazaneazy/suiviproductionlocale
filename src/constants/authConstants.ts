
import { UserRole } from '../types';

// Define role to permission mapping
export const rolePermissionsMap: Record<UserRole, string[]> = {
  'admin': ['*'], // Admin access to all modules
  'acceuil': ['acceuil', 'dossiers', 'dashboard'], // Access to accueil, dossiers and dashboard
  'inspecteur': ['inspections', 'notes-frais', 'dashboard'], // Access to inspections, notes-frais and dashboard
  'certificats': ['resultats', 'dossiers', 'dashboard'], // Access to resultats, dossiers and dashboard
  'analyste': ['statistiques', 'dossiers', 'dashboard'], // Access to statistiques, dossiers and dashboard
  'comptable': ['notes-frais', 'dossiers', 'dashboard'], // Access to notes-frais, dossiers and dashboard
  'responsable_technique': ['responsable-technique', 'dossiers', 'dashboard'], // Access to responsable-technique, dossiers and dashboard
  'chef_mission': ['inspections', 'dossiers', 'dashboard'], // Access to inspections, dossiers and dashboard
  'surveillant': ['inspections', 'dossiers', 'dashboard'], // Access to inspections, dossiers and dashboard
  'directeur': ['resultats', 'dossiers', 'dashboard'], // Access to resultats, dossiers and dashboard
  'directeur_general': ['*'], // Director general access to all modules
  'gestionnaire': ['dossiers', 'dashboard'], // Access to dossiers and dashboard
  'producteur': ['dashboard', 'dossiers'], // Access to dashboard and dossiers
  'responsable_qualite': ['certificates-creation', 'dossiers', 'dashboard'], // Access to certificates-creation, dossiers and dashboard
  'comite_validation': ['validation', 'dossiers', 'dashboard'] // Access to validation, dossiers and dashboard
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
