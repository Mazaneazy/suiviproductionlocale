
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { DialogTrigger } from '@/components/ui/dialog';

interface UserManagementHeaderProps {
  openDialog: () => void;
}

const UserManagementHeader: React.FC<UserManagementHeaderProps> = ({ openDialog }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-certif-blue">Gestion des utilisateurs</h1>
      <Button className="bg-certif-blue hover:bg-certif-blue/90" onClick={openDialog}>
        <PlusCircle className="mr-2" size={16} />
        Nouvel utilisateur
      </Button>
    </div>
  );
};

export default UserManagementHeader;
