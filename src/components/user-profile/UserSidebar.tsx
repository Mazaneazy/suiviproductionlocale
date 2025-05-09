
import React from 'react';
import { Calendar, Shield, FileText, BookOpen, Info } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User, UserAction } from '@/types';

interface UserSidebarProps {
  user: User;
  userActions: UserAction[];
  actionStats: {
    total: number;
    today: number;
    lastWeek: number;
  };
  dossierCount: number;
  getRoleLabel: (role: string) => string;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ 
  user, userActions, actionStats, dossierCount, getRoleLabel 
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarFallback className="bg-certif-blue text-white text-2xl">
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-gray-500 mb-2">{user.email}</p>
            <Badge className="mt-2" variant="outline">
              {getRoleLabel(user.role)}
            </Badge>
          </div>

          <Separator className="my-4" />
          
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-500">Date création:</span>
              </div>
              <span className="font-medium">{user.dateCreation ? new Date(user.dateCreation).toLocaleDateString() : 'N/A'}</span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center text-sm">
                <Shield className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-500">Permissions:</span>
              </div>
              <span className="font-medium">{user.permissions?.length || 0}</span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center text-sm">
                <FileText className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-500">Actions:</span>
              </div>
              <span className="font-medium">{userActions.length}</span>
            </div>

            {user.phone && (
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center text-sm">
                  <FileText className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-500">Téléphone:</span>
                </div>
                <span className="font-medium">{user.phone}</span>
              </div>
            )}
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center text-sm">
                <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-500">Dossiers:</span>
              </div>
              <span className="font-medium">{dossierCount}</span>
            </div>
          </div>

          <Separator className="my-4" />
          
          <div className="grid grid-cols-3 gap-2">
            <Card className="p-2 text-center">
              <p className="text-xs text-gray-500">Actions totales</p>
              <p className="text-xl font-bold text-certif-blue">{actionStats.total}</p>
            </Card>
            <Card className="p-2 text-center">
              <p className="text-xs text-gray-500">Aujourd'hui</p>
              <p className="text-xl font-bold text-green-500">{actionStats.today}</p>
            </Card>
            <Card className="p-2 text-center">
              <p className="text-xs text-gray-500">7 derniers jours</p>
              <p className="text-xl font-bold text-amber-500">{actionStats.lastWeek}</p>
            </Card>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant="outline">
            <Info className="h-4 w-4 mr-2" />
            Journaux d'activité
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardContent>
          <h3 className="text-sm font-medium mb-3">Modules accessibles</h3>
          <div className="space-y-1">
            {user.permissions?.map(permission => (
              <div 
                key={permission} 
                className="flex items-center py-1 text-sm"
              >
                <Shield className="h-3 w-3 mr-2 text-green-500" />
                <span>{permission}</span>
              </div>
            ))}
            {(!user.permissions || user.permissions.length === 0) && (
              <p className="text-sm text-gray-500">Aucune permission spécifique</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSidebar;
