
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

// Import refactored components
import ProfileHeader from '@/components/user-profile/ProfileHeader';
import UserSidebar from '@/components/user-profile/UserSidebar';
import ProfileTabs from '@/components/user-profile/ProfileTabs';

// Import utility functions
import { getRoleLabel, formatDate, calculateActionStats } from '@/utils/userUtils';

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { getUserById, getUserActions } = useAuth();
  const { dossiers, certificats } = useData();
  const [activeTab, setActiveTab] = useState("overview");

  const user = getUserById(userId as string);
  const userActions = getUserActions(userId as string);

  if (!user) {
    return (
      <Layout>
        <Helmet>
          <title>Utilisateur non trouvé | ANOR Certification</title>
        </Helmet>
        <div className="flex flex-col items-center justify-center h-96">
          <h1 className="text-2xl font-bold mb-4">Utilisateur non trouvé</h1>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded flex items-center"
            onClick={() => navigate('/user-management')}
          >
            Retour à la liste des utilisateurs
          </button>
        </div>
      </Layout>
    );
  }

  // Récupérer les dossiers associés à l'utilisateur
  const userDossiers = user.role === 'producteur' && user.producteurDossierId 
    ? dossiers.filter(d => d.id === user.producteurDossierId)
    : dossiers.filter(d => d.responsable === user.name || d.piloteTechniqueNom === user.name);

  // Récupérer les certificats associés à l'utilisateur
  const userCertificats = certificats.filter(cert => 
    cert.responsableQualiteId === userId || 
    userDossiers.some(d => d.id === cert.dossierId)
  );

  // Calculer les statistiques des actions
  const actionStats = calculateActionStats(userActions);

  return (
    <Layout>
      <Helmet>
        <title>{user.name} | Profil Complet | ANOR Certification</title>
      </Helmet>
      
      <ProfileHeader userId={userId as string} userName={user.name} />

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar with user info */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3">
          <UserSidebar 
            user={user}
            userActions={userActions}
            actionStats={actionStats}
            dossierCount={userDossiers.length}
            getRoleLabel={getRoleLabel}
          />
        </div>

        {/* Main content */}
        <div className="col-span-12 md:col-span-8 lg:col-span-9">
          <Card>
            <CardContent className="pt-6">
              <ProfileTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                user={user}
                userActions={userActions}
                userDossiers={userDossiers}
                userCertificats={userCertificats}
                actionStats={actionStats}
                formatDate={formatDate}
                getRoleLabel={getRoleLabel}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
