
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/hooks/useAuth";
import { Dossier } from "@/types";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock, ArrowRight } from "lucide-react";

export default function RecentDossiers() {
  const { dossiers } = useData();
  const { currentUser, hasAccess } = useAuth();
  
  // Filtrer les dossiers selon le rôle de l'utilisateur
  let filteredDossiers: Dossier[] = [];
  
  if (currentUser?.role === 'producteur' && currentUser?.producteurDossierId) {
    // Pour un producteur, afficher uniquement son dossier
    filteredDossiers = dossiers.filter(dossier => 
      dossier.id === currentUser.producteurDossierId
    );
  } else {
    // Pour les autres utilisateurs, afficher les dossiers récents
    filteredDossiers = [...dossiers]
      .sort((a, b) => {
        const dateA = a.dateTransmission || "";
        const dateB = b.dateTransmission || "";
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      })
      .slice(0, 5);
  }

  // Fonction pour obtenir la couleur du badge selon le statut
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'en_attente': return 'bg-amber-100 text-amber-800';
      case 'analyse_technique': return 'bg-blue-100 text-blue-800';
      case 'inspection_planifiee': return 'bg-purple-100 text-purple-800';
      case 'conforme': return 'bg-green-100 text-green-800';
      case 'non_conforme': return 'bg-red-100 text-red-800';
      case 'certifie': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Fonction pour formater le statut du dossier
  const formatStatus = (status: string) => {
    switch(status) {
      case 'en_attente': return 'En attente';
      case 'analyse_technique': return 'Analyse technique';
      case 'inspection_planifiee': return 'Inspection planifiée';
      case 'conforme': return 'Conforme';
      case 'non_conforme': return 'Non conforme';
      case 'certifie': return 'Certifié';
      default: return status;
    }
  };

  // Format date relative (ex: il y a 3 jours)
  const formatRelativeDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: fr });
    } catch (error) {
      return 'Date inconnue';
    }
  };

  return (
    <Card className="col-span-1 md:col-span-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Dossiers récents</CardTitle>
        {hasAccess('dossiers') && (
          <Link to="/dossiers" className="text-xs text-certif-blue hover:underline flex items-center">
            Voir tous <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        )}
      </CardHeader>
      <CardContent>
        {filteredDossiers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <p className="text-muted-foreground text-sm mb-2">Aucun dossier disponible</p>
            {hasAccess('dossiers') && currentUser?.role !== 'producteur' && (
              <Link 
                to="/dossiers"
                className="text-xs text-certif-blue hover:underline"
              >
                Créer un nouveau dossier
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDossiers.map(dossier => (
              <div 
                key={dossier.id} 
                className="flex items-center justify-between border-b pb-3 hover:bg-gray-50 -mx-2 px-2 rounded-md transition-colors duration-200"
              >
                <div>
                  <h3 className="font-medium">{dossier.operateurNom}</h3>
                  <div className="flex items-center">
                    <p className="text-sm text-muted-foreground mr-2">{dossier.typeProduit}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-0.5">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatRelativeDate(dossier.dateTransmission || '')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(dossier.status || 'en_attente')}>
                    {formatStatus(dossier.status || 'en_attente')}
                  </Badge>
                  {hasAccess('dossiers') && (
                    <Link 
                      to={`/dossiers?id=${dossier.id}`} 
                      className="text-xs text-certif-blue hover:underline whitespace-nowrap"
                    >
                      Voir détails
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
