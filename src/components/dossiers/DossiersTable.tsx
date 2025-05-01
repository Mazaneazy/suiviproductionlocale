
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dossier } from '@/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import DossierDetailsDialog from './DossierDetailsDialog';

interface DossiersTableProps {
  dossiers: Dossier[];
}

const DossiersTable: React.FC<DossiersTableProps> = ({ dossiers }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fonction pour obtenir la couleur du badge en fonction du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complet': return 'bg-green-500 text-white';
      case 'en_attente': return 'bg-yellow-500 text-white';
      case 'rejete': return 'bg-red-500 text-white';
      case 'en_cours': return 'bg-blue-500 text-white';
      case 'certifie': return 'bg-green-700 text-white';
      case 'a_corriger': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Fonction pour formater le statut pour l'affichage
  const formatStatus = (status: string) => {
    switch (status) {
      case 'complet': return 'Complet';
      case 'en_attente': return 'En attente';
      case 'rejete': return 'Rejeté';
      case 'en_cours': return 'En cours';
      case 'certifie': return 'Certifié';
      case 'a_corriger': return 'À corriger';
      default: return status;
    }
  };

  // Vérifier si une date butoir est dépassée
  const isOverdue = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    return today > deadlineDate;
  };

  // Calculer le nombre de jours avant échéance ou de retard
  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Date de transmission</TableHead>
            <TableHead>Opérateur/Promoteur</TableHead>
            <TableHead>Type de produit</TableHead>
            <TableHead>Responsable</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Échéance</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dossiers.length > 0 ? (
            dossiers.map((dossier) => {
              const daysUntilDeadline = getDaysUntilDeadline(dossier.dateButoir);
              const overdue = isOverdue(dossier.dateButoir);
              
              return (
                <TableRow key={dossier.id}>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="mr-2 text-gray-500" size={16} />
                      {new Date(dossier.dateTransmission).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{dossier.operateurNom}</div>
                    <div className="text-sm text-gray-500">
                      <User className="inline mr-1" size={14} />
                      {dossier.promoteurNom}
                    </div>
                  </TableCell>
                  <TableCell>{dossier.typeProduit}</TableCell>
                  <TableCell>{dossier.responsable}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(dossier.status)}>
                      {formatStatus(dossier.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className={`mr-2 ${overdue ? 'text-red-500' : 'text-gray-500'}`} size={16} />
                      <span>{new Date(dossier.dateButoir).toLocaleDateString()}</span>
                    </div>
                    {overdue && dossier.status !== 'certifie' && dossier.status !== 'rejete' && (
                      <div className="flex items-center text-xs text-red-500 mt-1">
                        <AlertTriangle size={12} className="mr-1" />
                        <span>En retard de {Math.abs(daysUntilDeadline)} jour{Math.abs(daysUntilDeadline) > 1 ? 's' : ''}</span>
                      </div>
                    )}
                    {!overdue && (
                      <div className="text-xs text-gray-500 mt-1">
                        Dans {daysUntilDeadline} jour{daysUntilDeadline > 1 ? 's' : ''}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <DossierDetailsDialog dossierId={dossier.id} />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
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
