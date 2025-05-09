
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, Clock, FileText, Settings, Shield, UserCog, List, BookOpen } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { getUserById, getUserActions, hasRole } = useAuth();
  const { dossiers } = useData();
  const [activeTab, setActiveTab] = useState("actions");

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

  // Récupérer les dossiers associés au producteur
  const producteurDossiers = user.role === 'producteur' && user.producteurDossierId 
    ? dossiers.filter(d => d.id === user.producteurDossierId)
    : [];

  // Calculer les statistiques des actions
  const actionStats = {
    total: userActions.length,
    today: userActions.filter(a => {
      const today = new Date();
      const actionDate = new Date(a.date);
      return actionDate.toDateString() === today.toDateString();
    }).length,
    lastWeek: userActions.filter(a => {
      const today = new Date();
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const actionDate = new Date(a.date);
      return actionDate >= lastWeek;
    }).length
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
        
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => navigate(`/user-management`)}
          >
            <UserCog className="mr-2" size={16} />
            Gestion des utilisateurs
          </Button>
          {hasRole(['admin', 'directeur_general']) && (
            <Button 
              onClick={() => navigate(`/user-edit/${userId}`)}
              className="bg-certif-blue hover:bg-certif-blue/90"
            >
              <Settings className="mr-2" size={16} />
              Modifier le profil
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Informations de l'utilisateur</CardTitle>
            <CardDescription>Détails du profil et statistiques</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center text-center mb-6">
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
            
            <div className="space-y-4 mt-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                  <Shield className="mr-2 h-4 w-4 text-certif-blue" />
                  Permissions
                </h3>
                <div className="flex flex-wrap gap-1">
                  {user.permissions?.map(permission => (
                    <Badge key={permission} variant="secondary" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <Card className="p-2 text-center">
                  <p className="text-xs text-gray-500">Actions totales</p>
                  <p className="text-xl font-bold text-certif-blue">{actionStats.total}</p>
                </Card>
                <Card className="p-2 text-center">
                  <p className="text-xs text-gray-500">Aujourd'hui</p>
                  <p className="text-xl font-bold text-green-500">{actionStats.today}</p>
                </Card>
                <Card className="p-2 text-center">
                  <p className="text-xs text-gray-500">Cette semaine</p>
                  <p className="text-xl font-bold text-amber-500">{actionStats.lastWeek}</p>
                </Card>
              </div>

              {user.dateCreation && (
                <div className="text-sm text-gray-500 flex items-center justify-center mt-4">
                  <Calendar size={12} className="mr-1" />
                  <span>Compte créé le {formatDate(user.dateCreation)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Activité et détails du compte</CardTitle>
            <CardDescription>Informations détaillées sur l'activité de l'utilisateur</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="actions" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4 grid grid-cols-3">
                <TabsTrigger value="actions">
                  <FileText className="mr-2 h-4 w-4" />
                  Historique d'actions
                </TabsTrigger>
                <TabsTrigger value="permissions">
                  <Shield className="mr-2 h-4 w-4" />
                  Permissions détaillées
                </TabsTrigger>
                {user.role === 'producteur' && (
                  <TabsTrigger value="dossiers">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Dossiers associés
                  </TabsTrigger>
                )}
                {user.role !== 'producteur' && (
                  <TabsTrigger value="modules">
                    <List className="mr-2 h-4 w-4" />
                    Accès aux modules
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="actions" className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button 
                    variant={activeTab === "actions" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab("actions")}
                  >
                    Toutes les actions
                  </Button>
                  {Object.keys(actionsByModule).map(module => (
                    <Button
                      key={module}
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab(module)}
                    >
                      {module.charAt(0).toUpperCase() + module.slice(1)}
                    </Button>
                  ))}
                </div>

                {userActions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                    <FileText className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                    <p>Aucune action enregistrée pour cet utilisateur</p>
                    <p className="text-sm">Les activités de l'utilisateur seront affichées ici</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {userActions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(action => (
                      <div key={action.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
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
                  </div>
                )}
              </TabsContent>

              {Object.entries(actionsByModule).map(([module, actions]) => (
                <TabsContent key={module} value={module} className="space-y-4">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-certif-blue" />
                    Actions du module {module.charAt(0).toUpperCase() + module.slice(1)}
                  </h3>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {actions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(action => (
                      <div key={action.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
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
                  </div>
                </TabsContent>
              ))}

              <TabsContent value="permissions" className="space-y-4">
                <h3 className="text-lg font-medium mb-2">Permissions et accès</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 text-certif-blue">Rôle: {getRoleLabel(user.role)}</h4>
                  <p className="text-sm text-gray-600 mb-4">Les permissions suivantes sont accordées en fonction du rôle:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {user.permissions?.map(permission => (
                      <div 
                        key={permission} 
                        className="bg-white p-3 rounded border flex items-center"
                      >
                        <Shield className="h-4 w-4 mr-2 text-green-500" />
                        <span>{permission}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="modules" className="space-y-4">
                <h3 className="text-lg font-medium mb-2">Accès aux modules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries({
                    'dashboard': { name: 'Tableau de bord', icon: <FileText className="h-4 w-4" /> },
                    'acceuil': { name: 'Chargé de clientèle', icon: <User className="h-4 w-4" /> },
                    'dossiers': { name: 'Gestion des Dossiers', icon: <FileText className="h-4 w-4" /> },
                    'inspections': { name: 'Inspections', icon: <FileText className="h-4 w-4" /> },
                    'resultats': { name: 'Certificats émis', icon: <FileText className="h-4 w-4" /> },
                    'statistiques': { name: 'Statistiques', icon: <FileText className="h-4 w-4" /> },
                    'notes-frais': { name: 'Notes de frais', icon: <FileText className="h-4 w-4" /> },
                    'user-management': { name: 'Gestion des utilisateurs', icon: <FileText className="h-4 w-4" /> }
                  }).map(([moduleKey, moduleInfo]) => {
                    const hasAccess = user.permissions?.includes(moduleKey) || user.permissions?.includes('*');
                    
                    return (
                      <div 
                        key={moduleKey}
                        className={`p-3 rounded-lg border flex items-center justify-between ${
                          hasAccess ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center">
                          {moduleInfo.icon}
                          <span className="ml-2">{moduleInfo.name}</span>
                        </div>
                        <Badge variant={hasAccess ? "success" : "secondary"} className={hasAccess ? "bg-green-500" : ""}>
                          {hasAccess ? 'Accès' : 'Non autorisé'}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              {user.role === 'producteur' && (
                <TabsContent value="dossiers" className="space-y-4">
                  <h3 className="text-lg font-medium mb-2">Dossiers associés au producteur</h3>
                  {producteurDossiers.length > 0 ? (
                    <div className="space-y-4">
                      {producteurDossiers.map(dossier => (
                        <Card key={dossier.id} className="p-4">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium text-certif-blue">{dossier.typeProduit}</h4>
                              <p className="text-sm text-gray-600">{dossier.operateurNom}</p>
                            </div>
                            <Badge className={
                              dossier.status === 'complet' ? 'bg-green-500' :
                              dossier.status === 'en_attente' ? 'bg-amber-500' :
                              dossier.status === 'rejete' ? 'bg-red-500' :
                              dossier.status === 'certifie' ? 'bg-green-700' : 'bg-blue-500'
                            }>
                              {dossier.status}
                            </Badge>
                          </div>
                          <div className="mt-2 text-sm">
                            <div className="flex items-center text-gray-500">
                              <Calendar className="mr-1 h-3 w-3" />
                              <span>Soumis le: {new Date(dossier.dateTransmission).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                      <FileText className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                      <p>Aucun dossier associé à ce producteur</p>
                    </div>
                  )}
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default UserDetails;
