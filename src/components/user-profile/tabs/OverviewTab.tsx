
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FileText, BookOpen, ChartPie, Clock, Calendar } from 'lucide-react';
import { UserAction } from '@/types';

interface OverviewTabProps {
  userActions: UserAction[];
  userDossiers: any[];
  userCertificats: any[];
  actionStats: {
    total: number;
    today: number;
    lastWeek: number;
  };
  formatDate: (dateString: string) => string;
  setActiveTab: (value: string) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  userActions, userDossiers, userCertificats, 
  actionStats, formatDate, setActiveTab 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default OverviewTab;
