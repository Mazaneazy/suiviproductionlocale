
import { Helmet } from 'react-helmet';
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentDossiers from "@/components/dashboard/RecentDossiers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  return (
    <Layout>
      <Helmet>
        <title>Tableau de bord | ANOR Certification</title>
      </Helmet>
      
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6 text-certif-blue">{getWelcomeMessage()}</h1>
        
        <DashboardStats />
        
        <div className="mt-8 grid gap-4 md:grid-cols-3">
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
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
