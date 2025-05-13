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
import { File, FileCheck, FileX, AlertTriangle } from 'lucide-react';
import { Dossier } from '@/types';
import { useNavigate } from 'react-router-dom';

interface DossiersTableProps {
  dossiers: Dossier[];
  filteredDossiers: Dossier[];
  onValidate: (id: string) => void;
  onReject: (id: string) => void;
  onMarkAsComplete: (id: string) => void;
  getStatusColor: (status: string) => string;
  formatStatus: (status: string) => string;
}

const DossiersTable: React.FC<DossiersTableProps> = ({
  dossiers,
  filteredDossiers,
  onValidate,
  onReject,
  onMarkAsComplete,
  getStatusColor,
  formatStatus
}) => {
  const navigate = useNavigate();
  
  const handleViewDetails = (dossierId: string) => {
    navigate(`/dossiers/${dossierId}`);
  };
  
  if (filteredDossiers.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Aucun dossier à afficher</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>Liste des dossiers</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Référence</TableHead>
            <TableHead>Opérateur</TableHead>
            <TableHead>Produit</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDossiers.map((dossier) => (
            <TableRow key={dossier.id}>
              <TableCell className="font-medium">{dossier.reference}</TableCell>
              <TableCell>{dossier.operateurNom}</TableCell>
              <TableCell>{dossier.typeProduit}</TableCell>
              <TableCell>{new Date(dossier.dateTransmission).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(dossier.status)}`}>
                  {formatStatus(dossier.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(dossier.id)}
                  >
                    <File className="mr-2 h-4 w-4" />
                    Détails
                  </Button>
                  {dossier.status === 'en_attente' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-orange-600" 
                      onClick={() => onMarkAsComplete(dossier.id)}
                    >
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Complet
                    </Button>
                  )}
                  {dossier.status === 'complet' && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-green-600" 
                        onClick={() => onValidate(dossier.id)}
                      >
                        <FileCheck className="mr-2 h-4 w-4" />
                        Valider
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600" 
                        onClick={() => onReject(dossier.id)}
                      >
                        <FileX className="mr-2 h-4 w-4" />
                        Rejeter
                      </Button>
                    </>
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

export default DossiersTable;
