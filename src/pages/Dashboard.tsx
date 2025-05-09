import { Helmet } from 'react-helmet';
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentDossiers from "@/components/dashboard/RecentDossiers";
import DashboardChart from "@/components/dashboard/DashboardChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState, useEffect } from 'react';
import DashboardCustomizer from '@/components/dashboard/DashboardCustomizer';
import { getUserDashboardLayout, saveDashboardLayout } from '@/utils/dashboardUtils';
import { Bell, Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { notifications } = useData();
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
        setDashboardLayout(['stats', 'chart', 'dossiers', 'notifications']);
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
    
    // Personnaliser le message avec le nom de l'utilisateur
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

  // Récupérer les notifications non lues
  const unreadNotifications = notifications.filter(notif => !notif.lue).slice(0, 5);

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
        case 'chart':
          return (
            <motion.div key="chart" variants={itemVariants} className="col-span-12 lg:col-span-8">
              <DashboardChart />
            </motion.div>
          );
        case 'dossiers':
          return (
            <motion.div key="dossiers" variants={itemVariants} className="col-span-12 lg:col-span-8 md:col-span-8">
              <RecentDossiers />
            </motion.div>
          );
        case 'notifications':
          return (
            <motion.div key="notifications" variants={itemVariants} className="col-span-12 md:col-span-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle>Notifications</CardTitle>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {unreadNotifications.length > 0 ? (
                    <div className="space-y-3">
                      {unreadNotifications.map(notif => (
                        <div key={notif.id} className="bg-gray-50 p-2 rounded-md border-l-2 border-blue-400">
                          <p className="text-sm font-medium">{notif.message}</p>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{new Date(notif.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Pas de nouvelles notifications
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        case 'calendar':
          return (
            <motion.div key="calendar" variants={itemVariants} className="col-span-12 md:col-span-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle>Calendrier</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-blue-50 p-2 rounded-md border-l-2 border-blue-400">
                      <p className="text-sm font-medium">Inspection - Sarl Agro Prod</p>
                      <p className="text-xs text-gray-600 mt-1">Aujourd'hui, 14:00</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded-md border-l-2 border-green-400">
                      <p className="text-sm font-medium">Comité technique</p>
                      <p className="text-xs text-gray-600 mt-1">Demain, 10:00</p>
                    </div>
                    <Link to="/calendar" className="text-xs text-certif-blue hover:underline flex items-center justify-end mt-2">
                      Voir tout le calendrier <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
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
        className="space-y-6"
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
              {['stats', 'chart', 'dossiers', 'notifications', 'calendar'].map(type => {
                const cardConfig = {
                  stats: { title: "Statistiques", description: "Aperçu statistique des dossiers" },
                  chart: { title: "Graphique des tendances", description: "Évolution des dossiers et certifications" },
                  dossiers: { title: "Dossiers récents", description: "Liste des derniers dossiers" },
                  notifications: { title: "Notifications", description: "Vos dernières notifications" },
                  calendar: { title: "Calendrier", description: "Prochains événements" }
                };
                const config = cardConfig[type as keyof typeof cardConfig];
                
                return (
                  <div 
                    key={type}
                    className="p-4 border-2 border-dashed rounded-lg bg-white shadow-sm cursor-move hover:border-certif-blue transition-colors duration-200"
                  >
                    <h3 className="font-medium">{config.title}</h3>
                    <p className="text-sm text-gray-500">{config.description}</p>
                  </div>
                );
              })}
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
