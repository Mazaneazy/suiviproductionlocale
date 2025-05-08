
import { Helmet } from 'react-helmet';
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentDossiers from "@/components/dashboard/RecentDossiers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { currentUser } = useAuth();
  
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
        <motion.h1 
          variants={itemVariants}
          className="text-3xl font-bold mb-2 text-certif-blue"
        >
          {getWelcomeMessage()}
        </motion.h1>
        
        <motion.div variants={itemVariants}>
          <DashboardStats />
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="grid gap-6 md:grid-cols-3"
        >
          <RecentDossiers />
          
          {currentUser?.role !== 'producteur' && (
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Pas de nouvelles notifications
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Dashboard;
