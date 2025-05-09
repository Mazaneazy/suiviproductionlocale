
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface ProfileHeaderProps {
  userId: string;
  userName: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userId, userName }) => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" onClick={() => navigate('/user-management')}>
          <ArrowLeft size={16} />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-certif-blue">Profil utilisateur</h1>
          <p className="text-gray-500">Informations détaillées et statistiques du compte</p>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button 
          variant="outline"
          onClick={() => navigate(`/user-details/${userId}`)}
        >
          <User className="mr-2" size={16} />
          Détails simples
        </Button>
        {hasRole(['admin', 'directeur_general']) && (
          <Button 
            className="bg-certif-blue hover:bg-certif-blue/90"
          >
            <Settings className="mr-2" size={16} />
            Gérer le compte
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
