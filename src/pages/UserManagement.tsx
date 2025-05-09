
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { User, UserRole } from '../types';
import { useToast } from '../hooks/use-toast';

// Import refactored components
import UserManagementHeader from '@/components/user-management/UserManagementHeader';
import UserSearchBar from '@/components/user-management/UserSearchBar';
import UserTable from '@/components/user-management/UserTable';
import AddUserDialog from '@/components/user-management/AddUserDialog';
import { getRoleLabel } from '@/utils/userUtils';

const UserManagement = () => {
  const { getAllUsers, createUser, getUserActions } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(getAllUsers());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleAddUser = async (userData: { name: string; email: string; role: UserRole; avatar: string }) => {
    try {
      const success = await createUser(userData);
      if (success) {
        toast({
          title: "Utilisateur créé",
          description: `L'utilisateur ${userData.name} a été créé avec succès`,
        });
        setUsers(getAllUsers());
        setDialogOpen(false);
      }
    } catch (error) {
      throw error; // Let the dialog component handle this error
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getRoleLabel(user.role).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get action count for a user
  const getActionCount = (userId: string) => {
    return getUserActions(userId).length;
  };

  // Get all existing emails for duplicate check
  const existingEmails = users.map(user => user.email);

  return (
    <Layout>
      <UserManagementHeader openDialog={() => setDialogOpen(true)} />
      
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <UserSearchBar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />
        
        <UserTable 
          users={filteredUsers}
          getActionCount={getActionCount}
        />
      </div>
      
      <AddUserDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAddUser={handleAddUser}
        existingEmails={existingEmails}
      />
    </Layout>
  );
};

export default UserManagement;
