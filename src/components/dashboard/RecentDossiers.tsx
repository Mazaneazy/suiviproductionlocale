
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/hooks/useAuth";
import { Dossier } from "@/types";
import { Link } from "react-router-dom";

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
      .sort((a, b) => new Date(b.dateSoumission || "").getTime() - new Date(a.dateSoumission || "").getTime())
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

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Dossiers récents</CardTitle>
      </CardHeader>
      <CardContent>
        {filteredDossiers.length === 0 ? (
          <p className="text-muted-foreground text-sm">Aucun dossier disponible</p>
        ) : (
          <div className="space-y-4">
            {filteredDossiers.map(dossier => (
              <div key={dossier.id} className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="font-medium">{dossier.operateurNom}</h3>
                  <p className="text-sm text-muted-foreground">{dossier.typeProduit}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(dossier.status || 'en_attente')}>
                    {formatStatus(dossier.status || 'en_attente')}
                  </Badge>
                  {hasAccess('dossiers') && (
                    <Link 
                      to={`/dossiers?id=${dossier.id}`} 
                      className="text-xs text-certif-blue hover:underline"
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
