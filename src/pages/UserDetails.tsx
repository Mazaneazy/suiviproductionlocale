
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import UserInfoCard from '@/components/users/UserInfoCard';
import UserActionsHistory from '@/components/users/UserActionsHistory';

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { getUserById, getUserActions } = useAuth();

  const user = getUserById(userId as string);
  const userActions = getUserActions(userId as string);

  if (!user) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-96">
          <h1 className="text-2xl font-bold mb-4">Utilisateur non trouvé</h1>
          <Button onClick={() => navigate('/user-management')}>
            <ArrowLeft className="mr-2" size={16} />
            Retour à la liste des utilisateurs
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" onClick={() => navigate('/user-management')}>
            <ArrowLeft size={16} />
          </Button>
          <h1 className="text-3xl font-bold text-certif-blue">Détails de l'utilisateur</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <UserInfoCard user={user} />
        <UserActionsHistory userActions={userActions} />
      </div>
    </Layout>
  );
};

export default UserDetails;
