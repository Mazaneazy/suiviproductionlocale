
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import ChangePasswordDialog from '@/components/auth/ChangePasswordDialog';
import { Button } from '@/components/ui/button';

const UserDropdown = () => {
  const { currentUser, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  
  if (!currentUser) {
    return (
      <Button variant="ghost" onClick={() => navigate('/login')}>
        Se connecter
      </Button>
    );
  }
  
  const initials = currentUser.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
  
  const roleName = getRoleName(currentUser.role);
  
  // Vérifier si l'utilisateur est admin ou a un rôle qui lui donne accès à la gestion des utilisateurs
  const canAccessUserManagement = hasRole(['admin', 'directeur_general']);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src="" alt={currentUser.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div>
            <p className="font-medium text-sm">{currentUser.name}</p>
            <p className="text-xs text-gray-500">{roleName}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => navigate('/dashboard')}>
          Tableau de bord
        </DropdownMenuItem>
        {canAccessUserManagement && (
          <DropdownMenuItem onSelect={() => navigate('/users')}>
            Gestion des utilisateurs
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <ChangePasswordDialog 
          trigger={
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Changer mon mot de passe
            </DropdownMenuItem>
          } 
        />
        <DropdownMenuItem onSelect={() => logout()}>
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

function getRoleName(role: string): string {
  const roleMap: Record<string, string> = {
    'admin': 'Administrateur',
    'acceuil': 'Chargé de clientèle',
    'inspecteur': 'Inspecteur',
    'certificats': 'Gestionnaire de certificats',
    'analyste': 'Analyste',
    'comptable': 'Comptable',
    'responsable_technique': 'Responsable Technique',
    'chef_mission': 'Chef de Mission',
    'surveillant': 'Surveillant',
    'directeur': 'Directeur',
    'directeur_general': 'Directeur Général',
    'gestionnaire': 'Gestionnaire Dossiers',
    'producteur': 'Producteur',
  };
  
  return roleMap[role] || role;
}

export default UserDropdown;
