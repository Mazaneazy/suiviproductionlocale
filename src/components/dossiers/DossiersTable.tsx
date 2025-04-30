
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
import { AlertCircle, Eye, Check, X } from 'lucide-react';
import { Dossier } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface DossiersTableProps {
  dossiers: Dossier[];
  onViewDetails?: (dossier: Dossier) => void;
  onApprove?: (dossier: Dossier) => void;
  onReject?: (dossier: Dossier) => void;
}

const DossiersTable = ({ dossiers, onViewDetails, onApprove, onReject }: DossiersTableProps) => {
  const { currentUser } = useAuth();
  const userRole = currentUser?.role;

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

  // Colonnes visibles selon le rôle
  const getVisibleColumns = () => {
    const baseColumns = ['operateur', 'produit', 'status'];
    
    switch (userRole) {
      case 'acceuil':
        return [...baseColumns, 'transmission', 'actions'];
      case 'analyste':
        return [...baseColumns, 'responsable', 'dateButoir', 'actions'];
      case 'directeur':
        return ['operateur', 'produit', 'status', 'responsable', 'transmission', 'dateButoir', 'actions'];
      default:
        return ['operateur', 'produit', 'transmission', 'responsable', 'status', 'dateButoir', 'actions'];
    }
  };

  const visibleColumns = getVisibleColumns();

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {visibleColumns.includes('operateur') && <TableHead>Opérateur</TableHead>}
            {visibleColumns.includes('produit') && <TableHead>Type de produit</TableHead>}
            {visibleColumns.includes('transmission') && <TableHead>Date transmission</TableHead>}
            {visibleColumns.includes('responsable') && <TableHead>Responsable</TableHead>}
            {visibleColumns.includes('status') && <TableHead>Status</TableHead>}
            {visibleColumns.includes('dateButoir') && <TableHead>Date butoir</TableHead>}
            {visibleColumns.includes('actions') && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {dossiers.length > 0 ? (
            dossiers.map((dossier) => (
              <TableRow key={dossier.id}>
                {visibleColumns.includes('operateur') && (
                  <TableCell className="font-medium">{dossier.operateurNom}</TableCell>
                )}
                {visibleColumns.includes('produit') && (
                  <TableCell>{dossier.typeProduit}</TableCell>
                )}
                {visibleColumns.includes('transmission') && (
                  <TableCell>{new Date(dossier.dateTransmission).toLocaleDateString()}</TableCell>
                )}
                {visibleColumns.includes('responsable') && (
                  <TableCell>{dossier.responsable}</TableCell>
                )}
                {visibleColumns.includes('status') && (
                  <TableCell>
                    <Badge className={getStatusColor(dossier.status)}>
                      {formatStatus(dossier.status)}
                    </Badge>
                  </TableCell>
                )}
                {visibleColumns.includes('dateButoir') && (
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
                )}
                {visibleColumns.includes('actions') && (
                  <TableCell>
                    <div className="flex space-x-2">
                      {onViewDetails && (
                        <Button variant="outline" size="sm" onClick={() => onViewDetails(dossier)}>
                          <Eye size={16} className="mr-1" /> Voir
                        </Button>
                      )}
                      
                      {/* Actions spécifiques par rôle */}
                      {userRole === 'directeur' && dossier.status === 'en_cours' && onApprove && (
                        <Button variant="default" size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => onApprove(dossier)}>
                          <Check size={16} className="mr-1" /> Valider
                        </Button>
                      )}
                      
                      {userRole === 'directeur' && dossier.status === 'en_cours' && onReject && (
                        <Button variant="destructive" size="sm" onClick={() => onReject(dossier)}>
                          <X size={16} className="mr-1" /> Rejeter
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={visibleColumns.length} className="h-24 text-center">
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
