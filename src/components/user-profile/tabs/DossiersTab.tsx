
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, FileText } from 'lucide-react';
import { User } from '@/types';

interface DossiersTabProps {
  userDossiers: any[];
  user: User;
}

const DossiersTab: React.FC<DossiersTabProps> = ({ userDossiers, user }) => {
  const navigate = useNavigate();
  
  return (
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
  );
};

export default DossiersTab;
