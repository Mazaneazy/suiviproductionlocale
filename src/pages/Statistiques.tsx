
import React from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '../contexts/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Statistiques = () => {
  const { dossiers, certificats, statistiques } = useData();
  
  // Données pour le graphique des statuts de dossiers
  const statusData = [
    { name: 'Certifiés', value: statistiques.dossiersCertifies },
    { name: 'En cours', value: statistiques.dossiersEnCours },
    { name: 'Rejetés', value: statistiques.dossiersRejetes },
    { name: 'En attente', value: dossiers.filter(d => d.status === 'en_attente').length },
    { name: 'À corriger', value: dossiers.filter(d => d.status === 'a_corriger').length },
  ];

  // Données pour le graphique des délais moyens de traitement par mois
  const currentYear = new Date().getFullYear();
  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  
  const monthlyData = monthNames.map((month, index) => {
    return {
      name: month,
      délai: Math.floor(Math.random() * 10) + 20, // Données simulées: entre 20 et 30 jours
      certificats: Math.floor(Math.random() * 8) + 1, // Données simulées: entre 1 et 8 certificats
    };
  });

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-certif-blue">Statistiques et Reporting</h1>
        <p className="text-gray-600 mt-2">
          Tableau de bord analytique des activités de certification
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total dossiers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{statistiques.totalDossiers}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Dossiers certifiés</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{statistiques.dossiersCertifies}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Délai moyen (jours)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-certif-blue">{statistiques.delaiMoyenTraitement}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Statut des dossiers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} dossiers`, 'Quantité']} />
                  <Legend />
                  <Bar dataKey="value" name="Nombre de dossiers" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Activité mensuelle {currentYear}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip formatter={(value, name) => 
                    [name === 'délai' ? `${value} jours` : `${value} certificats`, 
                     name === 'délai' ? 'Délai moyen' : 'Certificats délivrés']} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="délai" name="Délai moyen (jours)" fill="#0ea5e9" />
                  <Bar yAxisId="right" dataKey="certificats" name="Certificats délivrés" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance financière (FCFA)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData.map(m => ({
                ...m, 
                recettes: Math.floor(Math.random() * 2000000) + 1000000, // Données simulées: entre 1M et 3M FCFA
                dépenses: Math.floor(Math.random() * 1000000) + 500000, // Données simulées: entre 500K et 1.5M FCFA
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value.toLocaleString()} FCFA`, value === 'recettes' ? 'Recettes' : 'Dépenses']} />
                <Legend />
                <Bar dataKey="recettes" name="Recettes" fill="#22c55e" />
                <Bar dataKey="dépenses" name="Dépenses" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Statistiques;
