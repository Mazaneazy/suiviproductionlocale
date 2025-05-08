
import { Helmet } from 'react-helmet';
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentDossiers from "@/components/dashboard/RecentDossiers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState, useEffect } from 'react';
import DashboardCustomizer from '@/components/dashboard/DashboardCustomizer';
import { getUserDashboardLayout, saveDashboardLayout } from '@/utils/dashboardUtils';
import DashboardCard from '@/components/dashboard/DashboardCard';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [dashboardLayout, setDashboardLayout] = useState<string[]>([]);
  
  // Charger la disposition du tableau de bord de l'utilisateur
  useEffect(() => {
    if (currentUser?.id) {
      const userLayout = getUserDashboardLayout(currentUser.id);
      if (userLayout && userLayout.length > 0) {
        setDashboardLayout(userLayout);
      } else {
        // Disposition par défaut
        setDashboardLayout(['stats', 'dossiers', 'notifications']);
      }
    }
  }, [currentUser]);
  
  // Sauvegarder la disposition du tableau de bord
  const handleSaveLayout = (layout: string[]) => {
    if (currentUser?.id) {
      saveDashboardLayout(currentUser.id, layout);
      setDashboardLayout(layout);
      setIsCustomizing(false);
    }
  };
  
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let timeMessage = "Bonjour";
    
    if (hour >= 12 && hour < 18) {
      timeMessage = "Bon après-midi";
    } else if (hour >= 18) {
      timeMessage = "Bonsoir";
    }
    
    return `${timeMessage}, ${currentUser?.name || 'Utilisateur'}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  // Rendu des cartes en fonction de la disposition
  const renderDashboardCards = () => {
    return dashboardLayout.map(cardType => {
      switch(cardType) {
        case 'stats':
          return (
            <motion.div key="stats" variants={itemVariants} className="col-span-12">
              <DashboardStats />
            </motion.div>
          );
        case 'dossiers':
          return (
            <motion.div key="dossiers" variants={itemVariants} className="col-span-12 md:col-span-8">
              <RecentDossiers />
            </motion.div>
          );
        case 'notifications':
          return (
            <motion.div key="notifications" variants={itemVariants} className="col-span-12 md:col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Pas de nouvelles notifications
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        default:
          return null;
      }
    });
  };

  return (
    <Layout>
      <Helmet>
        <title>Tableau de bord | ANOR Certification</title>
      </Helmet>
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8"
      >
        <div className="flex justify-between items-center">
          <motion.h1 
            variants={itemVariants}
            className="text-3xl font-bold mb-2 text-certif-blue"
          >
            {getWelcomeMessage()}
          </motion.h1>
          
          <motion.div variants={itemVariants}>
            <DashboardCustomizer 
              isCustomizing={isCustomizing}
              setIsCustomizing={setIsCustomizing}
              currentLayout={dashboardLayout}
              onSaveLayout={handleSaveLayout}
            />
          </motion.div>
        </div>
        
        {isCustomizing ? (
          <motion.div variants={itemVariants} className="bg-gray-50 border-2 border-dashed border-gray-200 p-4 rounded-lg">
            <h2 className="text-lg font-medium mb-4">Personnalisation du tableau de bord</h2>
            <p className="text-sm text-gray-500 mb-4">Faites glisser les éléments pour réorganiser votre tableau de bord</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DashboardCard 
                type="stats" 
                title="Statistiques" 
                description="Aperçu statistique des dossiers" 
                isCustomizing={true}
              />
              <DashboardCard 
                type="dossiers" 
                title="Dossiers récents" 
                description="Liste des derniers dossiers" 
                isCustomizing={true}
              />
              <DashboardCard 
                type="notifications" 
                title="Notifications" 
                description="Vos dernières notifications" 
                isCustomizing={true}
              />
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-12 gap-6">
            {renderDashboardCards()}
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default Dashboard;
