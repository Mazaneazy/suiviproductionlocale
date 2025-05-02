
import React, { useState } from 'react';
import Layout from '../components/Layout';
import AccueilForm from '../components/acceuil/AccueilForm';
import { useData } from '../contexts/DataContext';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import DossierDetailsDialog from '../components/dossiers/DossierDetailsDialog';

const Accueil = () => {
  const { dossiers } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  // Function to get status color
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

  // Function to format status for display
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

  // Filter dossiers based on search term
  const filteredDossiers = dossiers.filter(dossier =>
    dossier.operateurNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dossier.typeProduit.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dossier.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-certif-blue">Poste d'Accueil</h1>
        <p className="text-gray-600 mt-2">
          Réception des dossiers de demande de certification
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-4">Nouveau dossier</h2>
        <AccueilForm />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Tous les dossiers</h2>
        
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher par opérateur, produit ou statut..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Opérateur</TableHead>
                <TableHead>Type de produit</TableHead>
                <TableHead>Date de transmission</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Détails</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDossiers.length > 0 ? (
                filteredDossiers.map((dossier) => (
                  <TableRow key={dossier.id}>
                    <TableCell className="font-medium">{dossier.operateurNom}</TableCell>
                    <TableCell>{dossier.typeProduit}</TableCell>
                    <TableCell>{new Date(dossier.dateTransmission).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(dossier.status)}>
                        {formatStatus(dossier.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DossierDetailsDialog dossierId={dossier.id} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Aucun dossier trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
};

export default Accueil;
