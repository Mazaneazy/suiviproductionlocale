
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft, User, Calendar, Clock, FileText, Shield, UserCog, List, BookOpen, Settings, ChartBar, ChartPie, Info } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { getUserById, getUserActions, hasRole } = useAuth();
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
    }).length,
    byModule: userActions.reduce<Record<string, number>>((acc, action) => {
      acc[action.module] = (acc[action.module] || 0) + 1;
      return acc;
    }, {}),
    byType: userActions.reduce<Record<string, number>>((acc, action) => {
      acc[action.action] = (acc[action.action] || 0) + 1;
      return acc;
    }, {})
  };

  return (
    <Layout>
      <Helmet>
        <title>{user.name} | Profil Complet | ANOR Certification</title>
      </Helmet>
      
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

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar with user info */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3 space-y-6">
          <Card>
            <CardContent className="pt-6">
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

              <Separator className="my-4" />
              
              <div className="space-y-4 mt-4">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-500">Date création:</span>
                  </div>
                  <span className="font-medium">{user.dateCreation ? new Date(user.dateCreation).toLocaleDateString() : 'N/A'}</span>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center text-sm">
                    <Shield className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-500">Permissions:</span>
                  </div>
                  <span className="font-medium">{user.permissions?.length || 0}</span>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center text-sm">
                    <FileText className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-500">Actions:</span>
                  </div>
                  <span className="font-medium">{userActions.length}</span>
                </div>

                {user.phone && (
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center text-sm">
                      <FileText className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-gray-500">Téléphone:</span>
                    </div>
                    <span className="font-medium">{user.phone}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center text-sm">
                    <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-500">Dossiers:</span>
                  </div>
                  <span className="font-medium">{userDossiers.length}</span>
                </div>
              </div>

              <Separator className="my-4" />
              
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
                  <p className="text-xs text-gray-500">7 derniers jours</p>
                  <p className="text-xl font-bold text-amber-500">{actionStats.lastWeek}</p>
                </Card>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                <Info className="h-4 w-4 mr-2" />
                Journaux d'activité
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Modules accessibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {user.permissions?.map(permission => (
                  <div 
                    key={permission} 
                    className="flex items-center py-1 text-sm"
                  >
                    <Shield className="h-3 w-3 mr-2 text-green-500" />
                    <span>{permission}</span>
                  </div>
                ))}
                {(!user.permissions || user.permissions.length === 0) && (
                  <p className="text-sm text-gray-500">Aucune permission spécifique</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="col-span-12 md:col-span-8 lg:col-span-9">
          <Card>
            <CardHeader className="pb-2">
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
              </Tabs>
            </CardHeader>
            <CardContent className="pt-6">
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total des actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <FileText className="h-8 w-8 text-certif-blue mr-4" />
                        <div>
                          <p className="text-2xl font-bold">{userActions.length}</p>
                          <p className="text-xs text-gray-500">Toutes les actions de l'utilisateur</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Dossiers associés</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <BookOpen className="h-8 w-8 text-amber-500 mr-4" />
                        <div>
                          <p className="text-2xl font-bold">{userDossiers.length}</p>
                          <p className="text-xs text-gray-500">Dossiers gérés ou associés</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Certificats</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <ChartPie className="h-8 w-8 text-green-500 mr-4" />
                        <div>
                          <p className="text-2xl font-bold">{userCertificats.length}</p>
                          <p className="text-xs text-gray-500">Certificats liés à l'utilisateur</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Résumé de l'activité récente</CardTitle>
                    <CardDescription>Activités des 7 derniers jours</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userActions.length > 0 ? (
                      <div className="space-y-4">
                        <div className="space-y-3">
                          {userActions
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .slice(0, 5)
                            .map(action => (
                              <div key={action.id} className="flex items-start p-3 border-b last:border-0">
                                <div className="bg-gray-100 p-2 rounded-full mr-3">
                                  <Clock className="h-4 w-4 text-gray-600" />
                                </div>
                                <div>
                                  <p className="font-medium">{action.action}</p>
                                  <p className="text-sm text-gray-600">{action.details}</p>
                                  <div className="flex mt-1 text-xs text-gray-500">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>{formatDate(action.date)}</span>
                                  </div>
                                </div>
                              </div>
                          ))}
                        </div>
                          
                        {userActions.length > 5 && (
                          <div className="flex justify-center">
                            <Button variant="link" onClick={() => setActiveTab("activity")}>
                              Voir toutes les actions
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <Clock className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p>Aucune action récente enregistrée</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Historique des activités</CardTitle>
                    <CardDescription>Toutes les actions effectuées par l'utilisateur</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-[600px] overflow-y-auto pr-2">
                      {userActions.length > 0 ? (
                        <div className="space-y-3">
                          {userActions
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .map(action => (
                              <Card key={action.id} className="p-3">
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center">
                                    <div className="bg-gray-100 p-2 rounded-full mr-3">
                                      <FileText className="h-4 w-4 text-certif-blue" />
                                    </div>
                                    <div>
                                      <p className="font-medium">{action.action}</p>
                                      <p className="text-sm text-gray-600">{action.details}</p>
                                    </div>
                                  </div>
                                  <Badge variant="outline">{action.module}</Badge>
                                </div>
                                <div className="flex mt-2 text-xs text-gray-500 justify-end">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  <span>{formatDate(action.date)}</span>
                                </div>
                              </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Clock className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                          <p>Aucune action enregistrée pour cet utilisateur</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="dossiers" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Dossiers associés</CardTitle>
                    <CardDescription>Dossiers gérés ou liés à cet utilisateur</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-[600px] overflow-y-auto pr-2">
                      {userDossiers.length > 0 ? (
                        <div className="space-y-3">
                          {userDossiers.map(dossier => (
                            <Card key={dossier.id} className="p-4">
                              <div className="flex justify-between">
                                <div>
                                  <h4 className="font-medium text-certif-blue">{dossier.typeProduit}</h4>
                                  <p className="text-sm text-gray-600">{dossier.operateurNom}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {dossier.responsable === user.name ? 'Responsable de dossier' : 
                                     dossier.piloteTechniqueNom === user.name ? 'Pilote technique' : 'Dossier associé'}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <Badge className={
                                    dossier.status === 'complet' ? 'bg-green-500' :
                                    dossier.status === 'en_attente' ? 'bg-amber-500' :
                                    dossier.status === 'rejete' ? 'bg-red-500' :
                                    dossier.status === 'certifie' ? 'bg-green-700' : 'bg-blue-500'
                                  }>
                                    {dossier.status}
                                  </Badge>
                                  <div className="mt-2 text-xs text-gray-500">
                                    <Calendar className="inline-block mr-1 h-3 w-3" />
                                    <span>Créé le: {new Date(dossier.dateTransmission).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3 flex justify-end">
                                <Button variant="outline" size="sm" onClick={() => navigate(`/dossiers?id=${dossier.id}`)}>
                                  Voir détails
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                          <p>Aucun dossier associé à cet utilisateur</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="permissions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Permissions et accès détaillés</CardTitle>
                    <CardDescription>Détail des autorisations système de l'utilisateur</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2 text-certif-blue">Rôle: {getRoleLabel(user.role)}</h3>
                        <p className="text-sm text-gray-600 mb-4">Les permissions suivantes sont accordées en fonction du rôle:</p>
                      </div>
                      
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

                      <div className="mt-6">
                        <h3 className="font-medium mb-2 text-certif-blue">Accès aux modules</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {Object.entries({
                            'dashboard': { name: 'Tableau de bord', icon: <User className="h-4 w-4" /> },
                            'acceuil': { name: 'Chargé de clientèle', icon: <User className="h-4 w-4" /> },
                            'dossiers': { name: 'Gestion des Dossiers', icon: <FileText className="h-4 w-4" /> },
                            'inspections': { name: 'Inspections', icon: <List className="h-4 w-4" /> },
                            'resultats': { name: 'Certificats émis', icon: <BookOpen className="h-4 w-4" /> },
                            'statistiques': { name: 'Statistiques', icon: <ChartPie className="h-4 w-4" /> },
                            'notes-frais': { name: 'Notes de frais', icon: <FileText className="h-4 w-4" /> },
                            'user-management': { name: 'Gestion utilisateurs', icon: <UserCog className="h-4 w-4" /> }
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
                                <Badge variant={hasAccess ? "outline" : "secondary"} className={hasAccess ? "bg-green-500 text-white" : ""}>
                                  {hasAccess ? 'Accès autorisé' : 'Non autorisé'}
                                </Badge>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
