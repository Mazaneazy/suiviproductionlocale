
import React from 'react';
import { UserAction } from '@/types';
import ActivityItem from './ActivityItem';
import EmptyActivityState from './EmptyActivityState';

interface ActivityListProps {
  userActions: UserAction[];
  formatDate: (dateString: string) => string;
}

const ActivityList: React.FC<ActivityListProps> = ({ userActions, formatDate }) => {
  if (userActions.length === 0) {
    return <EmptyActivityState />;
  }

  return (
    <div className="space-y-3">
      {userActions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map(action => (
          <ActivityItem
            key={action.id}
            action={action}
            formatDate={formatDate}
          />
        ))}
    </div>
  );
};

export default ActivityList;
