
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, Clock } from 'lucide-react';
import { UserAction } from '@/types';

interface ActivityTabProps {
  userActions: UserAction[];
  formatDate: (dateString: string) => string;
}

const ActivityTab: React.FC<ActivityTabProps> = ({ userActions, formatDate }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des activités</CardTitle>
        <CardDescription>Toutes les actions effectuées par l'utilisateur</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-h-[600px] overflow-y-auto pr-2">
          {userActions.length > 0 ? (
            <div className="space-y-3">
              {userActions
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map(action => (
                  <Card key={action.id} className="p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="bg-gray-100 p-2 rounded-full mr-3">
                          <FileText className="h-4 w-4 text-certif-blue" />
                        </div>
                        <div>
                          <p className="font-medium">{action.action}</p>
                          <p className="text-sm text-gray-600">{action.details}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{action.module}</Badge>
                    </div>
                    <div className="flex mt-2 text-xs text-gray-500 justify-end">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{formatDate(action.date)}</span>
                    </div>
                  </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Clock className="mx-auto h-10 w-10 text-gray-400 mb-2" />
              <p>Aucune action enregistrée pour cet utilisateur</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTab;
