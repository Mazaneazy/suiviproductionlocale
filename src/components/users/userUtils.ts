
import { User, UserRole } from '@/types';

// Role labels mapping
export const roleLabels: Record<string, string> = {
  'admin': 'Administrateur',
  'acceuil': 'Poste d\'Accueil',
  'inspecteur': 'Chef des Inspections',
  'analyste': 'Chargé du reporting',
  'surveillant': 'Agent de surveillance',
  'comptable': 'Responsable Notes de Frais',
  'directeur': 'Directeur Evaluation Conformité',
  'responsable_technique': 'Responsable Technique',
  'chef_mission': 'Chef de Mission d\'Inspection',
  'certificats': 'Délivrance des Certificats',
  'directeur_general': 'Directeur Général ANOR',
  'gestionnaire': 'Gestionnaire des Dossiers',
  'producteur': 'Producteur Local'
};

// Filter users based on search term
export const filterUsers = (users: User[], searchTerm: string): User[] => {
  if (!searchTerm) return users;
  
  return users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    roleLabels[user.role]?.toLowerCase().includes(searchTerm.toLowerCase())
  );
};
