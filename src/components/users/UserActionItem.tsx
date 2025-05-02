
import React from 'react';
import { FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from './dateUtils';
import { UserAction } from '@/types';

interface UserActionItemProps {
  action: UserAction;
}

const UserActionItem: React.FC<UserActionItemProps> = ({ action }) => {
  return (
    <div className="border rounded-lg p-3">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-2">
          <FileText size={16} className="text-certif-blue" />
          <span className="font-medium">{action.action}</span>
        </div>
        <Badge variant="outline">{action.module}</Badge>
      </div>
      <p className="text-sm mt-2 text-gray-600">{action.details}</p>
      <div className="flex items-center mt-2 text-xs text-gray-500">
        <span>{formatDate(action.date)}</span>
      </div>
    </div>
  );
};

export default UserActionItem;
