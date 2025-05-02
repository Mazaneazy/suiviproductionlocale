
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import AddUserDialog from '@/components/users/AddUserDialog';
import UserTable from '@/components/users/UserTable';
import UserSearch from '@/components/users/UserSearch';
import { filterUsers, roleLabels } from '@/components/users/userUtils';

const UserManagement = () => {
  const { getAllUsers } = useAuth();
  const [users, setUsers] = useState(getAllUsers());
  const [searchTerm, setSearchTerm] = useState('');
  
  const refreshUsers = () => {
    setUsers(getAllUsers());
  };

  const filteredUsers = filterUsers(users, searchTerm);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-certif-blue">Gestion des utilisateurs</h1>
        <AddUserDialog onUserAdded={refreshUsers} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <UserSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <UserTable users={filteredUsers} roleLabels={roleLabels} />
      </div>
    </Layout>
  );
};

export default UserManagement;
