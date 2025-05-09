
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck, FileText, ClipboardCheck, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardStats() {
  const { statistiques, dossiers, certificats } = useData();
  const { currentUser } = useAuth();

  // Statistiques pour tous les types d'utilisateurs
  const generalStats = [
    {
      title: "Dossiers en cours",
      value: statistiques.dossiersEnCours,
      icon: <FileText className="h-6 w-6 text-certif-blue" />,
      description: "Dossiers en traitement",
      trend: +5,
      trendLabel: "depuis le mois dernier"
    },
    {
      title: "Dossiers certifiés",
      value: statistiques.dossiersCertifies,
      icon: <FileCheck className="h-6 w-6 text-green-500" />,
      description: "Produits conformes",
      trend: +12,
      trendLabel: "depuis le mois dernier"
    },
    {
      title: "Inspections planifiées",
      value: dossiers.filter(d => d.status === "en_cours").length,
      icon: <ClipboardCheck className="h-6 w-6 text-amber-500" />,
      description: "En attente d'inspection",
      trend: -3,
      trendLabel: "depuis le mois dernier"
    },
    {
      title: "Certificats émis",
      value: certificats.length,
      icon: <TrendingUp className="h-6 w-6 text-certif-blue" />,
      description: "Ce mois-ci",
      trend: +8,
      trendLabel: "depuis le mois dernier"
    },
  ];

  // Statistiques pour un producteur (affiche uniquement ses dossiers)
  const producteurStats = currentUser?.producteurDossierId ? [
    {
      title: "Mon dossier",
      value: currentUser.producteurDossierId ? "En traitement" : "Non soumis",
      icon: <FileText className="h-6 w-6 text-certif-blue" />,
      description: "Statut actuel",
      trend: null,
      trendLabel: ""
    }
  ] : [];

  // Choisir les statistiques à afficher selon le rôle
  const displayStats = currentUser?.role === 'producteur' ? producteurStats : generalStats;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {displayStats.map((stat, index) => (
        <Card key={index} className="overflow-hidden border-l-4 hover:shadow-md transition-all duration-200" 
              style={{ borderLeftColor: getStatColor(stat.title) }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
              {stat.trend !== null && (
                <div className={`flex items-center ${stat.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.trend > 0 ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-sm font-medium">{Math.abs(stat.trend)}%</span>
                </div>
              )}
            </div>
            {stat.trend !== null && (
              <p className="text-[10px] text-muted-foreground mt-1">{stat.trendLabel}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Fonction pour obtenir la couleur en fonction du type de statistique
function getStatColor(title: string): string {
  switch (title) {
    case "Dossiers certifiés":
      return "#10B981"; // green-500
    case "Dossiers en cours":
      return "#3B82F6"; // certif-blue
    case "Inspections planifiées":
      return "#F59E0B"; // amber-500
    case "Certificats émis":
      return "#6366F1"; // indigo-500
    default:
      return "#3B82F6"; // certif-blue par défaut
  }
}
