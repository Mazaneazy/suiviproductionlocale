
import { UserRole } from '@/types';

// Define role to permission mapping
export const rolePermissionsMap: Record<UserRole, string[]> = {
  'admin': ['*'], // Admin access to all modules
  'acceuil': ['acceuil', 'dossiers'], // Added access to dossiers for status viewing
  'inspecteur': ['inspections', 'notes-frais'], // Renamed to "Responsable des missions" - added notes-frais access
  'certificats': ['resultats', 'dossiers'],
  'analyste': ['statistiques', 'dossiers'],
  'comptable': ['notes-frais', 'dossiers'],
  'responsable_technique': ['responsable-technique', 'dossiers'],
  'chef_mission': ['inspections', 'dossiers'],
  'surveillant': ['inspections', 'dossiers'],
  'directeur': ['resultats', 'dossiers'],
  'directeur_general': ['*'], // Director general access to all modules
  'gestionnaire': ['dossiers'],
  'producteur': ['dashboard', 'dossiers'], // Producteurs can access their dashboard and dossiers
  'responsable_qualite': ['certificates-creation', 'dossiers'], // Added dossiers access 
  'comite_validation': ['validation', 'dossiers'] // Added dossiers access
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
