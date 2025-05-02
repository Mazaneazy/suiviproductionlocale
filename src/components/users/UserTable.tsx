
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '@/types';
import { FileText } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface UserTableProps {
  users: User[];
  roleLabels: Record<string, string>;
}

const UserTable: React.FC<UserTableProps> = ({ users, roleLabels }) => {
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
            <TableHead>Détails</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.name}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant="outline" className="font-normal">
                  {roleLabels[user.role] || user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleViewDetails(user.id)}
                >
                  <FileText className="mr-1" size={14} />
                  Détail
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
