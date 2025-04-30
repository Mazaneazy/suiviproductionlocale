
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileCheck, FileText, ClipboardCheck, CreditCard, Home, BarChart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavigationProps {
  className?: string;
  onItemClick?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ className = '', onItemClick }) => {
  const { currentUser, hasAccess } = useAuth();
  const location = useLocation();

  // Définir les liens de navigation avec les modules associés
  const navLinks = [
    { to: '/dashboard', icon: <Home size={20} />, label: 'Tableau de bord', module: null }, // Accessible à tous
    { to: '/accueil', icon: <FileText size={20} />, label: 'Accueil', module: 'acceuil' },
    { to: '/dossiers', icon: <FileText size={20} />, label: 'Dossiers', module: 'dossiers' },
    { to: '/notes-frais', icon: <CreditCard size={20} />, label: 'Notes de frais', module: 'notes-frais' },
    { to: '/inspections', icon: <ClipboardCheck size={20} />, label: 'Inspections', module: 'inspections' },
    { to: '/certificats', icon: <FileCheck size={20} />, label: 'Certificats', module: 'certificats' },
    { to: '/statistiques', icon: <BarChart size={20} />, label: 'Statistiques', module: 'statistiques' },
    { to: '/responsable-technique', icon: <FileText size={20} />, label: 'Responsable Technique', module: 'responsable-technique' },
  ];

  // Filtrer les liens selon les droits d'accès de l'utilisateur
  const filteredNavLinks = navLinks.filter(link => 
    link.module === null || hasAccess(link.module)
  );

  // Adapter le titre du lien Dossier selon le rôle de l'utilisateur
  const adaptLinkLabels = (link: any) => {
    if (link.to === '/dossiers' && currentUser?.role === 'acceuil') {
      return 'Réception des dossiers';
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
