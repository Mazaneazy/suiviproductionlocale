
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { FileText } from 'lucide-react';
import { NoteFrais, Dossier } from '@/types';

interface NotesFraisDetailsProps {
  note: NoteFrais;
  dossiers: Dossier[];
  getStatusColor: (status: string) => string;
  formatStatus: (status: string) => string;
  calculerTotal: (note: NoteFrais) => number;
}

const NotesFraisDetails: React.FC<NotesFraisDetailsProps> = ({
  note,
  dossiers,
  getStatusColor,
  formatStatus,
  calculerTotal
}) => {
  return (
    <div className="py-4">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Opérateur</p>
          <p>{dossiers.find(d => d.id === note.dossierId || d.id === note.dossier_id)?.operateurNom || dossiers.find(d => d.id === note.dossierId || d.id === note.dossier_id)?.operateur_nom}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Date</p>
          <p>{new Date(note.date).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Statut</p>
          <Badge className={getStatusColor(note.status)}>
            {formatStatus(note.status)}
          </Badge>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Total</p>
          <p className="font-bold">{(note.montant || calculerTotal(note)).toLocaleString()} FCFA</p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 mb-4">
        <h3 className="font-medium mb-2">Détails des frais</h3>
        <div className="grid grid-cols-2 gap-2">
          <p className="text-sm">Gestion du dossier:</p>
          <p className="text-sm text-right">{(note.frais_gestion || note.fraisGestion || 0).toLocaleString() || '0'} FCFA</p>
          <p className="text-sm">Inspection/échantillonage:</p>
          <p className="text-sm text-right">{(note.frais_inspection || note.fraisInspection || 0).toLocaleString() || '0'} FCFA</p>
          <p className="text-sm">Analyses/essais:</p>
          <p className="text-sm text-right">{(note.frais_analyses || note.fraisAnalyses || 0).toLocaleString() || '0'} FCFA</p>
          <p className="text-sm">Surveillance:</p>
          <p className="text-sm text-right">{(note.frais_surveillance || note.fraisSurveillance || 0).toLocaleString() || '0'} FCFA</p>
        </div>
      </div>

      {note.commentaire && (
        <div className="border-t border-gray-200 pt-4 mb-4">
          <h3 className="font-medium mb-2">Commentaire</h3>
          <p className="text-sm">{note.commentaire}</p>
        </div>
      )}

      {(note.fichier_url || note.fichierUrl) && (
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-medium mb-2">Document joint</h3>
          <div className="flex items-center">
            <FileText size={20} className="mr-2 text-blue-500" />
            <a 
              href={note.fichier_url || note.fichierUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Voir le document
            </a>
          </div>
        </div>
      )}
      <DialogFooter className="mt-6">
        <DialogClose asChild>
          <Button>Fermer</Button>
        </DialogClose>
      </DialogFooter>
    </div>
  );
};

export default NotesFraisDetails;
