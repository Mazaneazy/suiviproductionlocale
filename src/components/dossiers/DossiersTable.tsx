
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { Dossier } from '@/types';

interface DossiersTableProps {
  dossiers: Dossier[];
}

const DossiersTable = ({ dossiers }: DossiersTableProps) => {
  // Fonction pour obtenir la couleur du badge en fonction du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complet':
        return 'bg-blue-500 text-white';
      case 'en_cours':
        return 'bg-yellow-500 text-white';
      case 'en_attente':
        return 'bg-gray-500 text-white';
      case 'rejete':
        return 'bg-red-500 text-white';
      case 'certifie':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Fonction pour formater le statut pour l'affichage
  const formatStatus = (status: string) => {
    switch (status) {
      case 'complet':
        return 'Complet';
      case 'en_cours':
        return 'En cours';
      case 'en_attente':
        return 'En attente';
      case 'rejete':
        return 'Rejeté';
      case 'certifie':
        return 'Certifié';
      default:
        return status;
    }
  };

  // Vérifier si un dossier est en retard
  const isLate = (dateButoir: string) => {
    const now = new Date();
    const butoir = new Date(dateButoir);
    return butoir < now;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Opérateur</TableHead>
            <TableHead>Type de produit</TableHead>
            <TableHead>Date transmission</TableHead>
            <TableHead>Responsable</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date butoir</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dossiers.length > 0 ? (
            dossiers.map((dossier) => (
              <TableRow key={dossier.id}>
                <TableCell className="font-medium">{dossier.operateurNom}</TableCell>
                <TableCell>{dossier.typeProduit}</TableCell>
                <TableCell>{new Date(dossier.dateTransmission).toLocaleDateString()}</TableCell>
                <TableCell>{dossier.responsable}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(dossier.status)}>
                    {formatStatus(dossier.status)}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center">
                    {isLate(dossier.dateButoir) && dossier.status !== 'certifie' && dossier.status !== 'rejete' && (
                      <AlertCircle className="mr-1 text-certif-red" size={16} />
                    )}
                    <span className={isLate(dossier.dateButoir) && dossier.status !== 'certifie' && dossier.status !== 'rejete' ? 'text-certif-red' : ''}>
                      {new Date(dossier.dateButoir).toLocaleDateString()}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    Voir détails
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Aucun dossier trouvé
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DossiersTable;
