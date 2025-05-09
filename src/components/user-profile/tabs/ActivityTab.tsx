
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { UserAction } from '@/types';
import ActivityList from '../activity/ActivityList';

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
          <ActivityList userActions={userActions} formatDate={formatDate} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTab;
