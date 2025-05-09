
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, User, FileText, List, BookOpen, ChartPie, UserCog } from 'lucide-react';
import { User as UserType } from '@/types';

interface PermissionsTabProps {
  user: UserType;
  getRoleLabel: (role: string) => string;
}

const PermissionsTab: React.FC<PermissionsTabProps> = ({ user, getRoleLabel }) => {
  const moduleAccessMap = {
    'dashboard': { name: 'Tableau de bord', icon: <User className="h-4 w-4" /> },
    'acceuil': { name: 'Chargé de clientèle', icon: <User className="h-4 w-4" /> },
    'dossiers': { name: 'Gestion des Dossiers', icon: <FileText className="h-4 w-4" /> },
    'inspections': { name: 'Inspections', icon: <List className="h-4 w-4" /> },
    'resultats': { name: 'Certificats émis', icon: <BookOpen className="h-4 w-4" /> },
    'statistiques': { name: 'Statistiques', icon: <ChartPie className="h-4 w-4" /> },
    'notes-frais': { name: 'Notes de frais', icon: <FileText className="h-4 w-4" /> },
    'responsable-technique': { name: 'Responsable technique', icon: <UserCog className="h-4 w-4" /> },
    'validation': { name: 'Comité de validation', icon: <UserCog className="h-4 w-4" /> },
    'certificates-creation': { name: 'Montage des certificats', icon: <UserCog className="h-4 w-4" /> },
    'user-management': { name: 'Gestion utilisateurs', icon: <UserCog className="h-4 w-4" /> }
  };

  // Check if user has admin or director general role (they have access to everything)
  const hasAdminAccess = user.role === 'admin' || user.role === 'directeur_general';
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Permissions et accès détaillés</CardTitle>
        <CardDescription>Détail des autorisations système de l'utilisateur</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2 text-certif-blue">Rôle: {getRoleLabel(user.role)}</h3>
            <p className="text-sm text-gray-600 mb-4">Les permissions suivantes sont accordées en fonction du rôle:</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {user.permissions?.map(permission => (
              <div 
                key={permission} 
                className="bg-white p-3 rounded border flex items-center"
              >
                <Shield className="h-4 w-4 mr-2 text-green-500" />
                <span>{permission}</span>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2 text-certif-blue">Accès aux modules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(moduleAccessMap).map(([moduleKey, moduleInfo]) => {
                const hasAccess = user.permissions?.includes(moduleKey) || user.permissions?.includes('*') || hasAdminAccess;
                
                return (
                  <div 
                    key={moduleKey}
                    className={`p-3 rounded-lg border flex items-center justify-between ${
                      hasAccess ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center">
                      {moduleInfo.icon}
                      <span className="ml-2">{moduleInfo.name}</span>
                    </div>
                    <Badge variant={hasAccess ? "outline" : "secondary"} className={hasAccess ? "bg-green-500 text-white" : ""}>
                      {hasAccess ? 'Accès autorisé' : 'Non autorisé'}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionsTab;
