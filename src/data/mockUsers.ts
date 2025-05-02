
import { User } from '@/types';

// Mock user data (replace with a real database or API)
export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    password: 'password',
    permissions: ['*'],
    actions: []
  },
  {
    id: '2',
    name: 'Accueil User',
    email: 'accueil@example.com',
    role: 'acceuil',
    password: 'password',
    permissions: ['acceuil'],
    actions: []
  },
  {
    id: '3',
    name: 'Inspecteur User',
    email: 'inspecteur@example.com',
    role: 'inspecteur',
    password: 'password',
    permissions: ['inspections'],
    actions: []
  },
  {
    id: '4',
    name: 'Certificats User',
    email: 'certificats@example.com',
    role: 'certificats',
    password: 'password',
    permissions: ['resultats'],
    actions: []
  },
  {
    id: '5',
    name: 'Analyste User',
    email: 'analyste@example.com',
    role: 'analyste',
    password: 'password',
    permissions: ['statistiques'],
    actions: []
  },
  {
    id: '6',
    name: 'Comptable User',
    email: 'comptable@example.com',
    role: 'comptable',
    password: 'password',
    permissions: ['notes-frais'],
    actions: []
  },
  {
    id: '7',
    name: 'Responsable Technique',
    email: 'rt@example.com',
    role: 'responsable_technique',
    password: 'password',
    permissions: ['responsable-technique'],
    actions: []
  },
  {
    id: '8',
    name: 'Chef de Mission',
    email: 'chef.mission@example.com',
    role: 'chef_mission',
    password: 'password',
    permissions: ['inspections'],
    actions: []
  },
  {
    id: '9',
    name: 'Surveillant User',
    email: 'surveillant@example.com',
    role: 'surveillant',
    password: 'password',
    permissions: ['inspections'],
    actions: []
  },
  {
    id: '10',
    name: 'Directeur User',
    email: 'directeur@example.com',
    role: 'directeur',
    password: 'password',
    permissions: ['resultats'],
    actions: []
  },
  {
    id: '11',
    name: 'Directeur General',
    email: 'dg@example.com',
    role: 'directeur_general',
    password: 'password',
    permissions: ['*'],
    actions: []
  },
  {
    id: '12',
    name: 'Gestionnaire Dossiers',
    email: 'gestionnaire@example.com',
    role: 'gestionnaire',
    password: 'password',
    permissions: ['dossiers'],
    actions: []
  },
];
