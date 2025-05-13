
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Send, Eye, AlertTriangle } from 'lucide-react';
import { Dossier, NoteFrais } from '@/types';
import { useNavigate } from 'react-router-dom';

interface NotesFraisTableProps {
  notesFrais: NoteFrais[];
  dossiers: Dossier[];
  onValidate: (id: string) => void;
  onReject: (id: string) => void;
  onSendNotification: (id: string) => void;
  onMarkAsNotified: (id: string) => void;
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
  getStatusColor,
  formatStatus,
  calculerTotal
}) => {
  const navigate = useNavigate();

  if (notesFrais.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Aucune note de frais à afficher</p>
      </div>
    );
  }

  const getDossierName = (dossierId: string) => {
    const dossier = dossiers.find(d => d.id === dossierId);
    return dossier ? dossier.operateurNom : 'Inconnu';
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>Liste des notes de frais</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead>Dossier</TableHead>
            <TableHead>Montant (FCFA)</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Paiement</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notesFrais.map((note) => (
            <TableRow key={note.id}>
              <TableCell className="font-medium">{new Date(note.date).toLocaleDateString()}</TableCell>
              <TableCell>{getDossierName(note.dossierId || '')}</TableCell>
              <TableCell>{calculerTotal(note).toLocaleString()}</TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(note.status)}`}>
                  {formatStatus(note.status)}
                </Badge>
              </TableCell>
              <TableCell>
                {note.acquitte ? (
                  <Badge className="bg-green-100 text-green-800">Acquitté</Badge>
                ) : (
                  <Badge className="bg-orange-100 text-orange-800">En attente</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(`/notes-frais/${note.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  {note.status === 'en_attente' && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-green-600" 
                        onClick={() => onValidate(note.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600" 
                        onClick={() => onReject(note.id)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  
                  {note.status === 'validee' && !note.notification_envoyee && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-blue-600" 
                      onClick={() => onSendNotification(note.id)}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {note.notification_envoyee && !note.operateur_notifie && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-orange-600" 
                      onClick={() => onMarkAsNotified(note.id)}
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default NotesFraisTable;
