
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useData } from '../contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import PrintStatisticsButton from '../components/statistiques/PrintStatisticsButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const Statistiques = () => {
  const { statistiques, dossiers, certificats } = useData();
  const [yearFilter, setYearFilter] = useState<string>('tous');
  
  // Obtenir les années disponibles
  const getCurrentYear = () => new Date().getFullYear();
  const availableYears = Array.from({ length: 5 }, (_, i) => (getCurrentYear() - 2 + i).toString());
  
  // Filtrer les certificats par année si un filtre est sélectionné
  const filteredCertificats = yearFilter === 'tous' 
    ? certificats 
    : certificats.filter(cert => new Date(cert.dateDelivrance).getFullYear().toString() === yearFilter);
  
  // Données pour le graphique des dossiers
  const dossierData = [
    { name: 'En cours', value: statistiques.dossiersEnCours, fill: '#3182CE' },
    { name: 'Certifiés', value: statistiques.dossiersCertifies, fill: '#38A169' },
    { name: 'Rejetés', value: statistiques.dossiersRejetes, fill: '#E53E3E' }
  ];
  
  // Données pour la répartition des certificats
  const certificatsParStatut = filteredCertificats.reduce((acc: Record<string, number>, cert) => {
    acc[cert.status] = (acc[cert.status] || 0) + 1;
    return acc;
  }, {});
  
  const certificatData = [
    { name: 'Actifs', value: certificatsParStatut.actif || 0, fill: '#38A169' },
    { name: 'Suspendus', value: certificatsParStatut.suspendu || 0, fill: '#ECC94B' },
    { name: 'Retirés', value: certificatsParStatut.retire || 0, fill: '#E53E3E' },
    { name: 'Expirés', value: certificatsParStatut.expire || 0, fill: '#718096' }
  ];
  
  // Produits certifiés (top 5)
  const produitsCertifies = filteredCertificats
    .reduce((acc: Record<string, number>, cert) => {
      acc[cert.produit] = (acc[cert.produit] || 0) + 1;
      return acc;
    }, {});

  const produitData = Object.entries(produitsCertifies)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([produit, count]) => ({ 
      name: produit, 
      value: count, 
      fill: '#3182CE' 
    }));
  
  // Données pour les délais de traitement
  const delaiData = [
    { name: '< 15 jours', value: dossiers.filter(d => d.delai < 15).length, fill: '#38A169' },
    { name: '15-30 jours', value: dossiers.filter(d => d.delai >= 15 && d.delai <= 30).length, fill: '#3182CE' },
    { name: '> 30 jours', value: dossiers.filter(d => d.delai > 30).length, fill: '#E53E3E' }
  ];
  
  // Couleurs pour le graphique pie
  const COLORS = ['#38A169', '#3182CE', '#E53E3E', '#ECC94B', '#718096'];

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-certif-blue">Statistiques</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Année:</span>
            <Select 
              value={yearFilter}
              onValueChange={setYearFilter}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Toutes les années" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Toutes</SelectItem>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <PrintStatisticsButton />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>{filteredCertificats.length}</CardTitle>
            <CardDescription>Total des certificats {yearFilter !== 'tous' ? `en ${yearFilter}` : ''}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm flex justify-between">
              <span>Actifs: {certificatsParStatut.actif || 0}</span>
              <span>Suspendus: {certificatsParStatut.suspendu || 0}</span>
              <span>Expirés: {certificatsParStatut.expire || 0}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{statistiques.delaiMoyenTraitement} jours</CardTitle>
            <CardDescription>Délai moyen de traitement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm flex justify-between">
              <span>Objectif: 30 jours</span>
              <span>Min: 7 jours</span>
              <span>Max: 60 jours</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{statistiques.totalDossiers}</CardTitle>
            <CardDescription>Total des dossiers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm flex justify-between">
              <span>Certification: {statistiques.dossiersCertifies}</span>
              <span>En cours: {statistiques.dossiersEnCours}</span>
              <span>Rejetés: {statistiques.dossiersRejetes}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Répartition des dossiers</CardTitle>
            <CardDescription>Par statut</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dossierData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
            <CardTitle>Statut des certificats</CardTitle>
            <CardDescription>Répartition par statut</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={certificatData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {certificatData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Top 5 des produits certifiés</CardTitle>
            <CardDescription>Produits les plus fréquemment certifiés {yearFilter !== 'tous' ? `en ${yearFilter}` : ''}</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={produitData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="value" name="Nombre de certifications" fill="#3182CE" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Distribution par année</CardTitle>
            <CardDescription>Evolution des certifications dans le temps</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={availableYears.map(year => ({
                  name: year,
                  value: certificats.filter(c => new Date(c.dateDelivrance).getFullYear().toString() === year).length
                }))}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" name="Nombre de certifications" fill="#38A169" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Financier (FCFA)</CardTitle>
          <CardDescription>Revenus générés par les certifications</CardDescription>
        </CardHeader>
        <CardContent className="h-96">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="text-lg font-medium mb-1">Frais de gestion</div>
                <div className="text-2xl font-bold">2,450,000 FCFA</div>
                <div className="text-sm text-gray-500 mt-1">70 dossiers traités</div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="text-lg font-medium mb-1">Frais d'inspection</div>
                <div className="text-2xl font-bold">3,760,000 FCFA</div>
                <div className="text-sm text-gray-500 mt-1">94 inspections réalisées</div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="text-lg font-medium mb-1">Frais de surveillance</div>
                <div className="text-2xl font-bold">1,820,000 FCFA</div>
                <div className="text-sm text-gray-500 mt-1">52 entreprises sous surveillance</div>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: 'T1', frais: 1850000 },
                  { name: 'T2', frais: 2120000 },
                  { name: 'T3', frais: 2340000 },
                  { name: 'T4', frais: 1720000 },
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${(value/1000000).toFixed(1)}M`} />
                <Tooltip formatter={(value) => `${value.toLocaleString()} FCFA`} />
                <Bar dataKey="frais" name="Revenus (FCFA)" fill="#38A169" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Statistiques;
