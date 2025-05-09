
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
}

interface NavigationProps {
  onItemClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, text }) => (
  <NavLink
    to={href}
    className={({ isActive }) =>
      cn(
        'flex items-center text-gray-600 py-2 px-3 rounded-md transition-colors',
        'hover:bg-gray-100 hover:text-certif-blue',
        isActive ? 'bg-certif-blue/10 text-certif-blue font-medium' : ''
      )
    }
  >
    <span className="mr-3">{icon}</span>
    <span>{text}</span>
  </NavLink>
);

const Navigation: React.FC<NavigationProps> = ({ onItemClick }) => {
  const { hasAccess, hasRole } = useAuth();

  return (
    <nav className="mt-4 space-y-1 px-2">
      {/* Accès pour tous les rôles */}
      <NavItem href="/dashboard" icon={<Home size={18} />} text="Tableau de bord" />

      {/* Poste d'accueil */}
      {hasAccess('acceuil') && (
        <NavItem href="/accueil" icon={<FilePlus2 size={18} />} text="Chargé de clientèle" />
      )}

      {/* Gestion des dossiers - pour tous sauf producteurs */}
      {(hasAccess('dossiers') || hasRole(['admin', 'directeur_general'])) && (
        <NavItem href="/dossiers" icon={<FileText size={18} />} text="Dossiers" />
      )}

      {/* Responsable technique */}
      {hasAccess('responsable-technique') && (
        <NavItem
          href="/responsable-technique"
          icon={<Settings size={18} />}
          text="Responsable Technique"
        />
      )}

      {/* Inspections */}
      {(hasAccess('inspections') || hasRole(['admin', 'directeur_general'])) && (
        <NavItem
          href="/inspections"
          icon={<ClipboardCheck size={18} />}
          text="Inspections"
        />
      )}

      {/* Résultats et certificats */}
      {(hasAccess('resultats') || hasRole(['admin', 'directeur_general'])) && (
        <NavItem
          href="/certificats"
          icon={<FileCheck2 size={18} />}
          text="Certificats émis"
        />
      )}

      {/* Statistiques et analyses */}
      {(hasAccess('statistiques') || hasRole(['admin', 'directeur_general'])) && (
        <NavItem
          href="/statistiques"
          icon={<BarChart2 size={18} />}
          text="Statistiques"
        />
      )}

      {/* Notes de frais */}
      {(hasAccess('notes-frais') || hasRole(['admin', 'directeur_general'])) && (
        <NavItem href="/notes-frais" icon={<Receipt size={18} />} text="Notes de frais" />
      )}

      {/* Gestion des utilisateurs - pour admin uniquement */}
      {hasRole(['admin', 'directeur_general']) && (
        <NavItem
          href="/user-management"
          icon={<UserCog size={18} />}
          text="Gestion utilisateurs"
        />
      )}
    </nav>
  );
};

export default Navigation;
