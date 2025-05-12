
import { UserRole } from '../types';

// Define role to permission mapping
export const rolePermissionsMap: Record<UserRole, string[]> = {
  'admin': ['*'], // Admin access to all modules
  'acceuil': ['acceuil', 'dossiers'], 
  'inspecteur': ['inspections', 'notes-frais', 'dossiers'], 
  'certificats': ['resultats', 'dossiers'],
  'analyste': ['statistiques', 'dossiers'],
  'comptable': ['notes-frais', 'dossiers'],
  'responsable_technique': ['responsable-technique', 'dossiers'],
  'chef_mission': ['inspections', 'dossiers'],
  'surveillant': ['inspections', 'dossiers'],
  'directeur': ['resultats', 'dossiers'],
  'directeur_general': ['*'], // Director general access to all modules
  'gestionnaire': ['dossiers'],
  'producteur': ['dashboard', 'dossiers'], 
  'responsable_qualite': ['certificates-creation', 'dossiers'], 
  'comite_validation': ['validation', 'dossiers'],
  'directeur_evaluation': ['resultats', 'dossiers']
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
