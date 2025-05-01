
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileCheck, FileText, ClipboardCheck, Home, BarChart, UserRound, Shield, Calculator } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavigationProps {
  className?: string;
  onItemClick?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ className = '', onItemClick }) => {
  const { currentUser, hasAccess } = useAuth();
  const location = useLocation();

  // Définir les liens de navigation avec les modules associés et les titres spécifiques par rôle
  const navLinks = [
    { to: '/dashboard', icon: <Home size={20} />, label: 'Tableau de bord', module: null }, // Accessible à tous
    { to: '/accueil', icon: <FileText size={20} />, label: 'Poste d\'Accueil', module: 'acceuil' },
    { to: '/dossiers', icon: <FileText size={20} />, label: 'Dossiers en cours', module: 'dossiers' },
    { to: '/inspections', icon: <ClipboardCheck size={20} />, label: 'Inspections', module: 'inspections' },
    { to: '/certificats', icon: <FileCheck size={20} />, label: 'Résultats', module: 'resultats' },
    { to: '/notes-frais', icon: <Calculator size={20} />, label: 'Notes de frais', module: 'notes-frais' },
    { to: '/statistiques', icon: <BarChart size={20} />, label: 'Statistiques', module: 'statistiques' },
    { to: '/responsable-technique', icon: <Shield size={20} />, label: 'Responsable Technique', module: 'responsable-technique' },
    { to: '/user-management', icon: <UserRound size={20} />, label: 'Gestion des utilisateurs', module: 'user-management' },
  ];

  // Filtrer les liens selon les droits d'accès de l'utilisateur
  const filteredNavLinks = navLinks.filter(link => 
    link.module === null || hasAccess(link.module)
  );

  // Adapter le titre du lien selon le rôle de l'utilisateur
  const adaptLinkLabels = (link: any) => {
    const roleTitles: Record<string, Record<string, string>> = {
      'acceuil': { '/accueil': 'Poste d\'Accueil' },
      'inspecteur': { '/inspections': 'Chef des Inspections' },
      'comptable': { '/notes-frais': 'Responsable Notes de Frais' },
      'analyste': { '/statistiques': 'Chargé du reporting' },
      'certificats': { '/certificats': 'Délivrance des Certificats' },
      'chef_mission': { '/inspections': 'Chef de Mission d\'Inspection' },
      'directeur': { '/certificats': 'Directeur Evaluation Conformité' },
      'directeur_general': { '/dashboard': 'Direction Générale ANOR' },
      'gestionnaire': { '/dossiers': 'Gestion des dossiers' },
    };

    if (currentUser?.role && roleTitles[currentUser.role] && roleTitles[currentUser.role][link.to]) {
      return roleTitles[currentUser.role][link.to];
    }

    return link.label;
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className={`space-y-2 ${className}`}>
      {filteredNavLinks.map(link => (
        <Link
          key={link.to}
          to={link.to}
          className={`flex items-center space-x-2 py-2 px-3 rounded-md ${isActive(link.to) ? 'bg-certif-lightblue text-certif-blue font-medium' : 'hover:bg-gray-100'} transition-colors`}
          onClick={onItemClick}
        >
          {link.icon}
          <span>{adaptLinkLabels(link)}</span>
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
