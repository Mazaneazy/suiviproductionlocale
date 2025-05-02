
import React from 'react';
import { User } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { roleLabels } from './userUtils';

interface UserInfoCardProps {
  user: User;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ user }) => {
  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2">
        <CardTitle>Informations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarFallback className="bg-certif-blue text-white text-2xl">
              {user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-gray-500 mb-2">{user.email}</p>
          <Badge className="mt-2" variant="outline">
            {roleLabels[user.role] || user.role}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;
