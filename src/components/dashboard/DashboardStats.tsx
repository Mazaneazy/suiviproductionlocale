
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck, FileText, ClipboardCheck, UserRound } from "lucide-react";
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
    },
    {
      title: "Dossiers certifiés",
      value: statistiques.dossiersCertifies,
      icon: <FileCheck className="h-6 w-6 text-green-500" />,
      description: "Produits conformes",
    },
    {
      title: "Inspections planifiées",
      // Fix: Only check for valid status values defined in the type
      value: dossiers.filter(d => d.status === "en_cours").length,
      icon: <ClipboardCheck className="h-6 w-6 text-amber-500" />,
      description: "En attente d'inspection",
    },
    {
      title: "Certificats émis",
      value: certificats.length,
      icon: <FileCheck className="h-6 w-6 text-certif-blue" />,
      description: "Ce mois-ci",
    },
  ];

  // Statistiques pour un producteur (affiche uniquement ses dossiers)
  const producteurStats = currentUser?.producteurDossierId ? [
    {
      title: "Mon dossier",
      value: currentUser.producteurDossierId ? "En traitement" : "Non soumis",
      icon: <FileText className="h-6 w-6 text-certif-blue" />,
      description: "Statut actuel",
    }
  ] : [];

  // Choisir les statistiques à afficher selon le rôle
  const displayStats = currentUser?.role === 'producteur' ? producteurStats : generalStats;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {displayStats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
