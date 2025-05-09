
import React from 'react';
import { FileText, Search, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const RapportsList = () => {
  // In a real application, we would fetch this data from an API
  const mockRapports = [
    {
      id: '1',
      dossierId: '1',
      inspectionId: '1',
      date: '2023-05-15',
      operateur: 'Entreprise A',
      status: 'transmis',
    },
    {
      id: '2',
      dossierId: '2',
      inspectionId: '2',
      date: '2023-06-10',
      operateur: 'Entreprise B',
      status: 'en_attente',
    },
    {
      id: '3',
      dossierId: '3',
      inspectionId: '3',
      date: '2023-06-20',
      operateur: 'Entreprise C',
      status: 'valide',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'transmis':
        return <Badge className="bg-blue-500">Transmis</Badge>;
      case 'en_attente':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">En attente</Badge>;
      case 'valide':
        return <Badge className="bg-green-500">Validé</Badge>;
      case 'rejete':
        return <Badge className="bg-red-500">Rejeté</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input placeholder="Rechercher..." className="pl-8" />
          </div>
          <Button className="bg-certif-blue hover:bg-certif-blue/90">
            <FileText className="mr-2 h-4 w-4" />
            Nouveau rapport
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Opérateur</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockRapports.map((rapport) => (
              <TableRow key={rapport.id}>
                <TableCell>
                  {new Date(rapport.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{rapport.operateur}</TableCell>
                <TableCell>{getStatusBadge(rapport.status)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    <FileCheck className="mr-2 h-4 w-4" />
                    Consulter
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RapportsList;
