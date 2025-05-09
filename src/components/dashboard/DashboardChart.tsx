
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { useData } from '@/contexts/DataContext';

// Configuration des couleurs du graphique
const chartConfig = {
  dossiers: { label: "Dossiers", theme: { light: "#3B82F6", dark: "#60A5FA" } },
  certifications: { label: "Certifications", theme: { light: "#10B981", dark: "#34D399" } },
};

const DashboardChart: React.FC = () => {
  const { certificats, dossiers } = useData();
  
  // Générer des données pour les 6 derniers mois
  const generateMonthlyData = () => {
    const data = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(currentDate.getMonth() - i);
      
      const monthYear = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
      const month = date.getMonth();
      const year = date.getFullYear();
      
      // Compter les dossiers créés ce mois
      const dossiersCount = dossiers.filter(d => {
        const creationDate = new Date(d.dateCreation || d.dateTransmission || '');
        return creationDate.getMonth() === month && creationDate.getFullYear() === year;
      }).length;
      
      // Compter les certifications émises ce mois
      const certificationsCount = certificats.filter(c => {
        const deliveryDate = new Date(c.dateDelivrance);
        return deliveryDate.getMonth() === month && deliveryDate.getFullYear() === year;
      }).length;
      
      data.push({
        name: monthYear,
        dossiers: dossiersCount,
        certifications: certificationsCount,
      });
    }
    
    return data;
  };
  
  const data = generateMonthlyData();

  return (
    <Card className="col-span-12 lg:col-span-8">
      <CardHeader>
        <CardTitle>Tendances</CardTitle>
        <CardDescription>Évolution des dossiers et certifications des 6 derniers mois</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDossiers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCertifications" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Tooltip 
                formatter={(value: number, name: string) => [value, name === 'dossiers' ? 'Dossiers' : 'Certifications']} 
                labelFormatter={(label) => `Période: ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="dossiers" 
                stroke="#3B82F6" 
                fillOpacity={1} 
                fill="url(#colorDossiers)" 
                name="dossiers"
              />
              <Area 
                type="monotone" 
                dataKey="certifications" 
                stroke="#10B981" 
                fillOpacity={1} 
                fill="url(#colorCertifications)" 
                name="certifications"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default DashboardChart;
