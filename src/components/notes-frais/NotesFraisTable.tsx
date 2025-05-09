
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Mail } from 'lucide-react';
import { NoteFrais } from '@/types';
import { Dossier } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface NotesFraisTableProps {
  notesFrais: NoteFrais[];
  dossiers: Dossier[];
  onValidate: (id: string) => void;
  onReject: (id: string) => void;
  onSendNotification: (id: string) => void;
  onMarkAsNotified: (id: string) => void;
  onShowDetails: (note: NoteFrais) => void;
  getStatusColor: (status: string) => string;
  formatStatus: (status: string) => string;
  calculerTotal: (note: NoteFrais) => number;
}

const NotesFraisTable: React.FC<NotesFraisTableProps> = ({
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
  const { currentUser } = useAuth();

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Opérateur</TableHead>
            <TableHead className="text-right">Gestion</TableHead>
            <TableHead className="text-right">Inspection</TableHead>
            <TableHead className="text-right">Analyses</TableHead>
            <TableHead className="text-right">Surveillance</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Notification</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notesFrais.length > 0 ? (
            notesFrais.map((note) => {
              const dossier = dossiers.find(d => d.id === note.dossierId);
              const total = note.montant || calculerTotal(note);
              
              return (
                <TableRow key={note.id}>
                  <TableCell>{new Date(note.date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{dossier?.operateurNom}</TableCell>
                  <TableCell className="text-right">{note.fraisGestion?.toLocaleString() || '0'} FCFA</TableCell>
                  <TableCell className="text-right">{note.fraisInspection?.toLocaleString() || '0'} FCFA</TableCell>
                  <TableCell className="text-right">{note.fraisAnalyses?.toLocaleString() || '0'} FCFA</TableCell>
                  <TableCell className="text-right">{note.fraisSurveillance?.toLocaleString() || '0'} FCFA</TableCell>
                  <TableCell className="text-right font-medium">{total.toLocaleString()} FCFA</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(note.status)}>
                      {formatStatus(note.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {note.notificationEnvoyee ? (
                      note.operateurNotifie ? (
                        <Badge className="bg-green-500 text-white">Reçue</Badge>
                      ) : (
                        <Badge className="bg-yellow-500 text-white">Envoyée</Badge>
                      )
                    ) : (
                      <Badge className="bg-gray-400 text-white">Non envoyée</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {note.status === 'en_attente' && currentUser?.role === 'comptable' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 text-green-500 hover:text-green-700"
                            onClick={() => onValidate(note.id)}
                          >
                            <Check size={16} />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                            onClick={() => onReject(note.id)}
                          >
                            <X size={16} />
                          </Button>
                        </>
                      )}
                      {note.status === 'valide' && note.notificationEnvoyee === false && (
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="h-8 w-8 text-blue-500 hover:text-blue-700"
                          onClick={() => onSendNotification(note.id)}
                          title="Envoyer une notification"
                        >
                          <Mail size={16} />
                        </Button>
                      )}
                      {note.notificationEnvoyee && !note.operateurNotifie && (
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="h-8 w-8 text-green-500 hover:text-green-700"
                          onClick={() => onMarkAsNotified(note.id)}
                          title="Marquer comme notifié"
                        >
                          <Check size={16} />
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onShowDetails(note)}
                      >
                        Détails
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="h-24 text-center">
                Aucune note de frais trouvée
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default NotesFraisTable;
