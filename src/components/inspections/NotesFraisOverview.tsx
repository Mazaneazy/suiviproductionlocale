
import React from 'react';
import { FileText, Search, FileCheck, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';

const NotesFraisOverview = () => {
  const { notesFrais, dossiers } = useData();

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'en_attente':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">En attente</Badge>;
      case 'valide':
        return <Badge className="bg-green-500">Validée</Badge>;
      case 'rejete':
        return <Badge className="bg-red-500">Rejetée</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getPaymentStatus = (acquitte?: boolean) => {
    return acquitte ? 
      <Badge className="bg-green-500">Payée</Badge> : 
      <Badge variant="outline" className="text-red-500 border-red-500">Non payée</Badge>;
  };
  
  const getCompanyName = (dossierId: string) => {
    const dossier = dossiers.find(d => d.id === dossierId);
    return dossier?.operateurNom || 'Entreprise inconnue';
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
            Créer note de frais
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Opérateur</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Paiement</TableHead>
              <TableHead className="text-right">Reçu</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notesFrais.map((note) => (
              <TableRow key={note.id}>
                <TableCell>
                  {new Date(note.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{getCompanyName(note.dossierId)}</TableCell>
                <TableCell>{note.montant?.toLocaleString()} FCFA</TableCell>
                <TableCell>{getStatusBadge(note.status)}</TableCell>
                <TableCell>{getPaymentStatus(note.acquitte)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" disabled={!note.acquitte}>
                    <Receipt className="mr-2 h-4 w-4" />
                    Voir reçu
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

export default NotesFraisOverview;
