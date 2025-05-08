
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
import { Check, FileText, Download } from 'lucide-react';
import { NoteFrais } from '@/types';

interface FraisValidationTableProps {
  frais: NoteFrais[];
  onValidate: (id: string) => void;
}

const FraisValidationTable: React.FC<FraisValidationTableProps> = ({ 
  frais, 
  onValidate 
}) => {
  // Formatter les montants en francs CFA
  const formatMontant = (montant: number) => {
    return montant.toLocaleString('fr-FR') + ' FCFA';
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Montant</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Pièce jointe</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {frais.length > 0 ? (
            frais.map((noteFrais) => (
              <TableRow key={noteFrais.id}>
                <TableCell className="font-medium">{noteFrais.description}</TableCell>
                <TableCell>{new Date(noteFrais.date).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">{formatMontant(noteFrais.montant)}</TableCell>
                <TableCell>
                  {noteFrais.acquitte ? (
                    <Badge className="bg-green-500 text-white">Acquitté</Badge>
                  ) : noteFrais.status === 'valide' ? (
                    <Badge className="bg-blue-500 text-white">Validé</Badge>
                  ) : noteFrais.status === 'rejete' ? (
                    <Badge className="bg-red-500 text-white">Rejeté</Badge>
                  ) : (
                    <Badge className="bg-gray-500 text-white">En attente</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {noteFrais.fichierUrl ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 px-2 text-gray-600"
                      asChild
                    >
                      <a href={noteFrais.fichierUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-1" />
                        Document
                      </a>
                    </Button>
                  ) : (
                    <span className="text-gray-400 text-sm">Non fourni</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {noteFrais.status === 'valide' && !noteFrais.acquitte && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 border-green-500 text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => onValidate(noteFrais.id)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Confirmer acquittement
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Aucune note de frais à valider
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FraisValidationTable;
