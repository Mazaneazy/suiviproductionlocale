
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserRound, FileText, Settings } from 'lucide-react';
import { User } from '@/types';
import { getRoleLabel } from '@/utils/userUtils';

interface UserTableProps {
  users: User[];
  getActionCount: (userId: string) => number;
}

const UserTable: React.FC<UserTableProps> = ({ users, getActionCount }) => {
  const navigate = useNavigate();

  const handleViewDetails = (userId: string) => {
    navigate(`/user-details/${userId}`);
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Actions système</TableHead>
            <TableHead>Détails</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  <div className="bg-gray-100 p-1 rounded-full">
                    <UserRound size={20} className="text-gray-500" />
                  </div>
                  <span>{user.name}</span>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant="outline" className="font-normal">
                  {getRoleLabel(user.role)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {getActionCount(user.id)} actions
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleViewDetails(user.id)}
                  >
                    <FileText className="mr-1" size={14} />
                    Détail
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/user-profile/${user.id}`)}
                  >
                    <Settings className="mr-1" size={14} />
                    Profil complet
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
