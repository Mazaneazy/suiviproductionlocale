
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Clock, FileText, Shield } from 'lucide-react';
import OverviewTab from './tabs/OverviewTab';
import ActivityTab from './tabs/ActivityTab';
import DossiersTab from './tabs/DossiersTab';
import PermissionsTab from './tabs/PermissionsTab';
import { User as UserType, UserAction } from '@/types';

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  user: UserType;
  userActions: UserAction[];
  userDossiers: any[];
  userCertificats: any[];
  actionStats: any;
  formatDate: (dateString: string) => string;
  getRoleLabel: (role: string) => string;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  activeTab,
  setActiveTab,
  user,
  userActions,
  userDossiers,
  userCertificats,
  actionStats,
  formatDate,
  getRoleLabel
}) => {
  return (
    <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="overview">
          <User className="mr-2 h-4 w-4" />
          Vue d'ensemble
        </TabsTrigger>
        <TabsTrigger value="activity">
          <Clock className="mr-2 h-4 w-4" />
          Activité
        </TabsTrigger>
        <TabsTrigger value="dossiers">
          <FileText className="mr-2 h-4 w-4" />
          Dossiers
        </TabsTrigger>
        <TabsTrigger value="permissions">
          <Shield className="mr-2 h-4 w-4" />
          Permissions
        </TabsTrigger>
      </TabsList>

      <div className="mt-6">
        <TabsContent value="overview">
          <OverviewTab 
            userActions={userActions}
            userDossiers={userDossiers}
            userCertificats={userCertificats}
            actionStats={actionStats}
            formatDate={formatDate}
            setActiveTab={setActiveTab}
          />
        </TabsContent>

        <TabsContent value="activity">
          <ActivityTab 
            userActions={userActions}
            formatDate={formatDate}
          />
        </TabsContent>

        <TabsContent value="dossiers">
          <DossiersTab 
            userDossiers={userDossiers}
            user={user}
          />
        </TabsContent>

        <TabsContent value="permissions">
          <PermissionsTab 
            user={user}
            getRoleLabel={getRoleLabel}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default ProfileTabs;
