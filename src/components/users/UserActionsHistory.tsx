
import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserAction } from '@/types';
import UserActionItem from './UserActionItem';
import { formatDate } from './dateUtils';

interface UserActionsHistoryProps {
  userActions: UserAction[];
}

const UserActionsHistory: React.FC<UserActionsHistoryProps> = ({ userActions }) => {
  // Group actions by module
  const actionsByModule = userActions.reduce<Record<string, UserAction[]>>((acc, action) => {
    if (!acc[action.module]) {
      acc[action.module] = [];
    }
    acc[action.module].push(action);
    return acc;
  }, {});

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle>Historique des actions</CardTitle>
      </CardHeader>
      <CardContent>
        {userActions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucune action enregistrée pour cet utilisateur
          </div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Toutes les actions</TabsTrigger>
              {Object.keys(actionsByModule).map(module => (
                <TabsTrigger key={module} value={module}>
                  {module.charAt(0).toUpperCase() + module.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {userActions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map(action => (
                  <UserActionItem key={action.id} action={action} />
                ))}
            </TabsContent>

            {Object.entries(actionsByModule).map(([module, actions]) => (
              <TabsContent key={module} value={module} className="space-y-4">
                {actions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map(action => (
                    <div key={action.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <span className="font-medium">{action.action}</span>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock size={12} className="mr-1" />
                          <span>{formatDate(action.date)}</span>
                        </div>
                      </div>
                      <p className="text-sm mt-2 text-gray-600">{action.details}</p>
                    </div>
                  ))}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default UserActionsHistory;
