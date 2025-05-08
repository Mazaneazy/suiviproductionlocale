
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
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye } from 'lucide-react';
import { RapportInspection } from '@/types';

interface RapportsTableProps {
  rapports: RapportInspection[];
  onViewRapport: (rapport: RapportInspection) => void;
}

const RapportsTable: React.FC<RapportsTableProps> = ({ rapports, onViewRapport }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'valide':
        return <Badge className="bg-green-500 text-white">Validé</Badge>;
      case 'rejete':
        return <Badge className="bg-red-500 text-white">Rejeté</Badge>;
      case 'transmis':
        return <Badge className="bg-blue-500 text-white">Transmis</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">En attente</Badge>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Inspection</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Document</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rapports.length > 0 ? (
            rapports.map((rapport) => (
              <TableRow key={rapport.id}>
                <TableCell>{new Date(rapport.date).toLocaleDateString()}</TableCell>
                <TableCell className="font-medium">{rapport.inspectionId}</TableCell>
                <TableCell>{getStatusBadge(rapport.status)}</TableCell>
                <TableCell>
                  {rapport.fichierUrl ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 px-2 text-gray-600"
                      asChild
                    >
                      <a href={rapport.fichierUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-1" />
                        Télécharger
                      </a>
                    </Button>
                  ) : (
                    <span className="text-gray-400 text-sm">Non disponible</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onViewRapport(rapport)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                Aucun rapport disponible
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RapportsTable;
