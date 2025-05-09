
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Calendar, FileText } from 'lucide-react';
import { UserAction } from '@/types';

interface ActivityItemProps {
  action: UserAction;
  formatDate: (dateString: string) => string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ action, formatDate }) => {
  return (
    <Card className="p-3">
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
  );
};

export default ActivityItem;
