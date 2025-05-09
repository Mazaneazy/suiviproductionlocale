
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  Home,
  FileText,
  ClipboardCheck,
  FileCheck2,
  BarChart2,
  Receipt,
  UserCog,
  FilePlus2,
  Settings,
} from 'lucide-react';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
}

interface NavigationProps {
  onItemClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, text, onClick }) => (
  <NavLink
    to={href}
    className={({ isActive }) =>
      cn(
        'flex items-center text-gray-600 py-2 px-3 rounded-md transition-colors',
        'hover:bg-gray-100 hover:text-certif-blue',
        isActive ? 'bg-certif-blue/10 text-certif-blue font-medium' : ''
      )
    }
    onClick={onClick}
  >
    <span className="mr-3">{icon}</span>
    <span>{text}</span>
  </NavLink>
);

const Navigation: React.FC<NavigationProps> = ({ onItemClick }) => {
  const { hasAccess, hasRole } = useAuth();

  return (
    <nav className="mt-4 space-y-1 px-2">
      {/* Tableau de bord - accessible à tous */}
      <NavItem 
        href="/dashboard" 
        icon={<Home size={18} />} 
        text="Tableau de bord" 
        onClick={onItemClick} 
      />

      {/* Poste d'accueil */}
      {hasAccess('acceuil') && (
        <NavItem 
          href="/accueil" 
          icon={<FilePlus2 size={18} />} 
          text="Chargé de clientèle" 
          onClick={onItemClick}
        />
      )}

      {/* Gestion des dossiers */}
      {hasAccess('dossiers') && (
        <NavItem 
          href="/dossiers" 
          icon={<FileText size={18} />} 
          text="Dossiers" 
          onClick={onItemClick}
        />
      )}

      {/* Responsable technique */}
      {hasAccess('responsable-technique') && (
        <NavItem
          href="/responsable-technique"
          icon={<Settings size={18} />}
          text="Responsable Technique"
          onClick={onItemClick}
        />
      )}

      {/* Inspections */}
      {hasAccess('inspections') && (
        <NavItem
          href="/inspections"
          icon={<ClipboardCheck size={18} />}
          text="Inspections"
          onClick={onItemClick}
        />
      )}

      {/* Résultats et certificats */}
      {hasAccess('resultats') && (
        <NavItem
          href="/certificats"
          icon={<FileCheck2 size={18} />}
          text="Certificats émis"
          onClick={onItemClick}
        />
      )}

      {/* Statistiques et analyses */}
      {hasAccess('statistiques') && (
        <NavItem
          href="/statistiques"
          icon={<BarChart2 size={18} />}
          text="Statistiques"
          onClick={onItemClick}
        />
      )}

      {/* Notes de frais */}
      {hasAccess('notes-frais') && (
        <NavItem 
          href="/notes-frais" 
          icon={<Receipt size={18} />} 
          text="Notes de frais" 
          onClick={onItemClick}
        />
      )}

      {/* Gestion des utilisateurs - pour admin uniquement */}
      {hasRole(['admin', 'directeur_general']) && (
        <NavItem
          href="/user-management"
          icon={<UserCog size={18} />}
          text="Gestion utilisateurs"
          onClick={onItemClick}
        />
      )}
    </nav>
  );
};

export default Navigation;
