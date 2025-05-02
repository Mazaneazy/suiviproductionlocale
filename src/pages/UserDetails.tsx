
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, Clock, FileText } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';

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

  const getRoleLabel = (role: string) => {
    const roleLabels: Record<string, string> = {
      'admin': 'Administrateur',
      'acceuil': 'Poste d\'Accueil',
      'inspecteur': 'Chef des Inspections',
      'analyste': 'Chargé du reporting',
      'surveillant': 'Agent de surveillance',
      'comptable': 'Responsable Notes de Frais',
      'directeur': 'Directeur Evaluation Conformité',
      'responsable_technique': 'Responsable Technique',
      'chef_mission': 'Chef de Mission d\'Inspection',
      'certificats': 'Délivrance des Certificats',
      'directeur_general': 'Directeur Général ANOR',
      'gestionnaire': 'Gestionnaire des Dossiers',
      'producteur': 'Producteur Local'
    };

    return roleLabels[role] || role;
  };

  // Grouper les actions par module
  const actionsByModule = userActions.reduce<Record<string, typeof userActions>>((acc, action) => {
    if (!acc[action.module]) {
      acc[action.module] = [];
    }
    acc[action.module].push(action);
    return acc;
  }, {});

  // Formater la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
                {getRoleLabel(user.role)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Historique des actions</CardTitle>
          </CardHeader>
          <CardContent>
            {userActions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucune action enregistrée pour cet utilisateur
              </div>
            ) : (
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">Toutes les actions</TabsTrigger>
                  {Object.keys(actionsByModule).map(module => (
                    <TabsTrigger key={module} value={module}>
                      {module.charAt(0).toUpperCase() + module.slice(1)}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  {userActions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(action => (
                    <div key={action.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2">
                          <FileText size={16} className="text-certif-blue" />
                          <span className="font-medium">{action.action}</span>
                        </div>
                        <Badge variant="outline">{action.module}</Badge>
                      </div>
                      <p className="text-sm mt-2 text-gray-600">{action.details}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <Calendar size={12} className="mr-1" />
                        <span>{formatDate(action.date)}</span>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                {Object.entries(actionsByModule).map(([module, actions]) => (
                  <TabsContent key={module} value={module} className="space-y-4">
                    {actions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(action => (
                      <div key={action.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <span className="font-medium">{action.action}</span>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock size={12} className="mr-1" />
                            <span>{formatDate(action.date)}</span>
                          </div>
                        </div>
                        <p className="text-sm mt-2 text-gray-600">{action.details}</p>
                      </div>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default UserDetails;
