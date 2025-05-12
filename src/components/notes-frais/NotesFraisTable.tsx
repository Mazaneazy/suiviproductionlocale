
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, CheckCircle, AlertTriangle, Bell, Eye } from 'lucide-react';
import { NoteFrais, Dossier } from '@/types';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import NotesFraisDownloadButton from './NotesFraisDownloadButton';

interface NoteFraisTableProps {
  notesFrais: NoteFrais[];
  dossiers: Dossier[];
  onValidate: (id: string) => void;
  onReject: (id: string) => void;
  onSendNotification: (id: string) => void;
  onMarkAsNotified: (id: string) => void;
  onShowDetails: (noteFrais: NoteFrais) => void;
  getStatusColor: (status: string) => string;
  formatStatus: (status: string) => string;
  calculerTotal: (noteFrais: NoteFrais) => number;
}

const NotesFraisTable: React.FC<NoteFraisTableProps> = ({ 
  notesFrais,
  dossiers,
  onValidate,
  onReject,
  onSendNotification,
  onMarkAsNotified,
  onShowDetails,
  getStatusColor,
  formatStatus,
  calculerTotal
}) => {
  const { hasRole } = useAuth();
  
  // Vérifier les rôles pour les différentes actions
  const canValidate = hasRole(['comptable', 'admin', 'directeur_general']);
  const canNotify = hasRole(['comptable', 'acceuil', 'admin', 'directeur_general']);
  
  // Trouver le nom de l'opérateur pour un dossier donné
  const getOperatorName = (dossierId: string): string => {
    const dossier = dossiers.find(d => d.id === dossierId);
    return dossier ? dossier.operateurNom : 'Inconnu';
  };
  
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Opérateur</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Paiement</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notesFrais.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">
                Aucune note de frais trouvée
              </TableCell>
            </TableRow>
          ) : (
            notesFrais.map((noteFrais) => (
              <TableRow key={noteFrais.id}>
                <TableCell className="font-medium">
                  {getOperatorName(noteFrais.dossierId)}
                </TableCell>
                <TableCell>
                  {new Date(noteFrais.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {calculerTotal(noteFrais).toLocaleString()} FCFA
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(noteFrais.status)}>
                    {formatStatus(noteFrais.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {noteFrais.acquitte ? (
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                      Acquitté
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
                      En attente
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center space-x-2">
                    <NotesFraisDownloadButton noteFraisId={noteFrais.id} />

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onShowDetails(noteFrais)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Détails
                        </DropdownMenuItem>
                        {canValidate && noteFrais.status === 'en_attente' && (
                          <>
                            <DropdownMenuItem onClick={() => onValidate(noteFrais.id)}>
                              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                              Valider
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onReject(noteFrais.id)}>
                              <AlertTriangle className="h-4 w-4 mr-2 text-amber-600" />
                              Rejeter
                            </DropdownMenuItem>
                          </>
                        )}
                        {canNotify && noteFrais.status === 'valide' && !noteFrais.notificationEnvoyee && (
                          <DropdownMenuItem onClick={() => onSendNotification(noteFrais.id)}>
                            <Bell className="h-4 w-4 mr-2 text-blue-600" />
                            Notifier l'opérateur
                          </DropdownMenuItem>
                        )}
                        {canNotify && noteFrais.notificationEnvoyee && !noteFrais.operateurNotifie && (
                          <DropdownMenuItem onClick={() => onMarkAsNotified(noteFrais.id)}>
                            <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                            Marquer comme notifié
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default NotesFraisTable;
