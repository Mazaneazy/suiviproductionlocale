
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { Dossier } from '@/types';

interface DossiersTechTableProps {
  dossiers: Dossier[];
  onSelectDossier: (id: string) => void;
  selectedDossierId: string | null;
}

const DossiersTechTable = ({ 
  dossiers, 
  onSelectDossier, 
  selectedDossierId 
}: DossiersTechTableProps) => {

  // Formatter le statut pour l'affichage
  const formatStatus = (status: string) => {
    switch (status) {
      case 'complet':
        return 'Complet';
      case 'en_attente':
        return 'En attente';
      default:
        return status;
    }
  };

  // Définir la couleur du badge en fonction du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complet':
        return 'bg-blue-500 text-white';
      case 'en_attente':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
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
            <TableHead>Produit</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date limite</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dossiers.length > 0 ? (
            dossiers.map((dossier) => (
              <TableRow 
                key={dossier.id}
                onClick={() => onSelectDossier(dossier.id)}
                className={`cursor-pointer hover:bg-gray-100 ${selectedDossierId === dossier.id ? 'bg-certif-lightblue' : ''}`}
              >
                <TableCell className="font-medium">{dossier.operateurNom}</TableCell>
                <TableCell>{dossier.typeProduit}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(dossier.status)}>
                    {formatStatus(dossier.status)}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center">
                    {isLate(dossier.dateButoir) && (
                      <AlertCircle className="mr-1 text-certif-red" size={16} />
                    )}
                    <span className={isLate(dossier.dateButoir) ? 'text-certif-red' : ''}>
                      {new Date(dossier.dateButoir).toLocaleDateString()}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                Aucun dossier en attente de traitement
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DossiersTechTable;
