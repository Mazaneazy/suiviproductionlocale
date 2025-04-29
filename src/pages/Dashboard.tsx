
import React from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import Layout from '../components/Layout';
import { BarChart as BarChartIcon, FileText, FileCheck, AlertCircle, CheckCircle, Clock, Calendar, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { statistiques, dossiers, certificats } = useData();
  const { currentUser, hasRole } = useAuth();

  // Calculer les dossiers en retard (date limite dépassée)
  const currentDate = new Date();
  const dossiersEnRetard = dossiers.filter(
    (dossier) => new Date(dossier.dateButoir) < currentDate && dossier.status !== 'certifie' && dossier.status !== 'rejete'
  );

  // Données pour les graphiques
  const chartData = [
    {
      name: 'En cours',
      value: statistiques.dossiersEnCours,
      fill: '#3182CE' // Bleu
    },
    {
      name: 'Certifiés',
      value: statistiques.dossiersCertifies,
      fill: '#38A169' // Vert
    },
    {
      name: 'Rejetés',
      value: statistiques.dossiersRejetes,
      fill: '#E53E3E' // Rouge
    }
  ];

  // Calculer le taux de certification
  const tauxCertification = statistiques.totalDossiers > 0 
    ? Math.round((statistiques.dossiersCertifies / statistiques.totalDossiers) * 100) 
    : 0;

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6 text-certif-blue">Tableau de bord</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Bienvenue, {currentUser?.name}</h2>
        <p className="text-gray-600">
          Voici un aperçu du statut actuel des dossiers de certification.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total des dossiers</CardDescription>
            <CardTitle className="text-3xl flex items-center">
              {statistiques.totalDossiers}
              <FileText className="ml-auto text-certif-blue" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-500">Tous statuts confondus</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Dossiers certifiés</CardDescription>
            <CardTitle className="text-3xl flex items-center">
              {statistiques.dossiersCertifies}
              <CheckCircle className="ml-auto text-certif-green" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-500">Taux de certification: {tauxCertification}%</div>
            <Progress value={tauxCertification} className="h-2 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Dossiers en cours</CardDescription>
            <CardTitle className="text-3xl flex items-center">
              {statistiques.dossiersEnCours}
              <Clock className="ml-auto text-certif-blue" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-500">En attente de traitement</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Dossiers en retard</CardDescription>
            <CardTitle className="text-3xl flex items-center">
              {dossiersEnRetard.length}
              <AlertCircle className="ml-auto text-certif-red" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-500">Dépassement du délai imparti</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChartIcon className="mr-2" size={20} />
              Répartition des dossiers
            </CardTitle>
            <CardDescription>
              Par statut
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" name="Nombre de dossiers" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2" size={20} />
              Prochaines échéances
            </CardTitle>
            <CardDescription>
              Dossiers dont la date butoir approche
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dossiers.filter(d => d.status !== 'certifie' && d.status !== 'rejete')
                .sort((a, b) => new Date(a.dateButoir).getTime() - new Date(b.dateButoir).getTime())
                .slice(0, 5)
                .map((dossier) => {
                  const dateButoir = new Date(dossier.dateButoir);
                  const diffDays = Math.ceil((dateButoir.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
                  const isLate = diffDays < 0;
                  
                  return (
                    <div key={dossier.id} className="flex items-center p-3 border rounded-md">
                      <div className="flex-1">
                        <h4 className="font-medium">{dossier.operateurNom}</h4>
                        <p className="text-sm text-gray-500">{dossier.typeProduit}</p>
                      </div>
                      <div className={`text-right ${isLate ? 'text-certif-red' : diffDays <= 5 ? 'text-certif-yellow' : 'text-certif-green'}`}>
                        <div className="font-medium">
                          {dateButoir.toLocaleDateString()}
                        </div>
                        <div className="text-xs">
                          {isLate 
                            ? `En retard de ${Math.abs(diffDays)} jour${Math.abs(diffDays) > 1 ? 's' : ''}`
                            : `Dans ${diffDays} jour${diffDays > 1 ? 's' : ''}`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              
              {dossiers.filter(d => d.status !== 'certifie' && d.status !== 'rejete').length === 0 && (
                <div className="text-center p-4 text-gray-500">
                  Aucun dossier en cours
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileCheck className="mr-2" size={20} />
              Derniers certificats émis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {certificats.slice(0, 5).map((certificat) => (
                <div key={certificat.id} className="flex items-center p-3 border rounded-md">
                  <div className="flex-1">
                    <h4 className="font-medium">{certificat.entreprise}</h4>
                    <p className="text-sm text-gray-500">Certificat #{certificat.numero}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {new Date(certificat.dateDelivrance).toLocaleDateString()}
                    </div>
                    <div className={`text-xs ${certificat.status === 'actif' ? 'text-certif-green' : 'text-certif-red'}`}>
                      {certificat.status === 'actif' ? 'Actif' : certificat.status === 'suspendu' ? 'Suspendu' : certificat.status === 'expire' ? 'Expiré' : 'Retiré'}
                    </div>
                  </div>
                </div>
              ))}
              
              {certificats.length === 0 && (
                <div className="text-center p-4 text-gray-500">
                  Aucun certificat émis
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2" size={20} />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2 items-center">
                  <span className="text-sm font-medium">Délai moyen de traitement</span>
                  <span className="text-certif-blue font-medium">{statistiques.delaiMoyenTraitement} jours</span>
                </div>
                <Progress value={Math.min(100, (statistiques.delaiMoyenTraitement / 45) * 100)} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-2 items-center">
                  <span className="text-sm font-medium">Taux de certification</span>
                  <span className="text-certif-green font-medium">{tauxCertification}%</span>
                </div>
                <Progress value={tauxCertification} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-2 items-center">
                  <span className="text-sm font-medium">Taux de dossiers en retard</span>
                  <span className="text-certif-red font-medium">
                    {statistiques.totalDossiers > 0 
                      ? Math.round((dossiersEnRetard.length / statistiques.totalDossiers) * 100) 
                      : 0}%
                  </span>
                </div>
                <Progress value={statistiques.totalDossiers > 0 
                  ? Math.round((dossiersEnRetard.length / statistiques.totalDossiers) * 100) 
                  : 0} 
                  className="h-2" 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
