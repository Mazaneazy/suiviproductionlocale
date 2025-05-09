
import { User } from '@/types';

// Mock user data (replace with a real database or API)
export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Administrateur',
    email: 'admin@example.com',
    role: 'admin',
    password: 'password',
    permissions: ['*'],
    actions: []
  },
  {
    id: '2',
    name: 'Chargé de la clientèle',
    email: 'accueil@example.com',
    role: 'acceuil',
    password: 'password',
    permissions: ['acceuil'],
    actions: []
  },
  {
    id: '3',
    name: 'Responsable des missions',
    email: 'inspecteur@example.com',
    role: 'inspecteur',
    password: 'password',
    permissions: ['inspections'],
    actions: []
  },
  {
    id: '4',
    name: 'Gestionnaire de Certificats',
    email: 'certificats@example.com',
    role: 'certificats',
    password: 'password',
    permissions: ['resultats'],
    actions: []
  },
  {
    id: '5',
    name: 'Analyste',
    email: 'analyste@example.com',
    role: 'analyste',
    password: 'password',
    permissions: ['statistiques'],
    actions: []
  },
  {
    id: '6',
    name: 'Chargé des notes de frais',
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
    name: 'Surveillant ',
    email: 'surveillant@example.com',
    role: 'surveillant',
    password: 'password',
    permissions: ['inspections'],
    actions: []
  },
  {
    id: '10',
    name: 'Directeur',
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
