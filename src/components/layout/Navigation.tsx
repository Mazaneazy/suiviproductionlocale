
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  FileText, 
  ClipboardCheck, 
  FileCheck, 
  Users, 
  Home, 
  ChartBar,
  Calendar
} from 'lucide-react';

interface NavigationProps {
  onItemClick?: () => void;  // Make this prop optional
}

const Navigation: React.FC<NavigationProps> = ({ onItemClick }) => {
  const { hasAccess } = useAuth();

  const handleClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  const navItems = [
    {
      title: 'Tableau de bord',
      path: '/dashboard',
      icon: <Home className="mr-2 h-5 w-5" />,
      access: true
    },
    {
      title: 'Dossiers',
      path: '/dossiers',
      icon: <FileText className="mr-2 h-5 w-5" />,
      access: hasAccess('dossiers')
    },
    {
      title: 'Inspections',
      path: '/inspections',
      icon: <ClipboardCheck className="mr-2 h-5 w-5" />,
      access: hasAccess('inspections')
    },
    {
      title: 'Calendrier',
      path: '/calendar',
      icon: <Calendar className="mr-2 h-5 w-5" />,
      access: hasAccess('inspections')
    },
    {
      title: 'Certificats',
      path: '/certificats',
      icon: <FileCheck className="mr-2 h-5 w-5" />,
      access: hasAccess('resultats')
    },
    {
      title: 'Statistiques',
      path: '/statistiques',
      icon: <ChartBar className="mr-2 h-5 w-5" />,
      access: hasAccess('statistiques')
    },
    {
      title: 'Utilisateurs',
      path: '/user-management',
      icon: <Users className="mr-2 h-5 w-5" />,
      access: hasAccess('user-management')
    }
  ];

  return (
    <nav className="space-y-1">
      {navItems
        .filter(item => item.access)
        .map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-certif-blue text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
            onClick={handleClick}
          >
            {item.icon}
            {item.title}
          </NavLink>
        ))}
    </nav>
  );
};

export default Navigation;
