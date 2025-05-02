
import React from 'react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar, MapPin, User } from 'lucide-react';
import { Inspection } from '@/types';

interface InspectionsTableProps {
  filteredInspections: Inspection[];
  handleMarkAsConforme: (id: string) => void;
  handleMarkAsNonConforme: (id: string) => void;
  handleViewDetails: (id: string) => void;
}

const InspectionsTable: React.FC<InspectionsTableProps> = ({
  filteredInspections,
  handleMarkAsConforme,
  handleMarkAsNonConforme,
  handleViewDetails
}) => {
  const { dossiers } = useData();
  const { currentUser } = useAuth();

  // Fonction pour obtenir la couleur du badge en fonction du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'conforme':
        return 'bg-green-500 text-white';
      case 'non_conforme':
        return 'bg-red-500 text-white';
      case 'en_attente':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Fonction pour formater le statut pour l'affichage
  const formatStatus = (status: string) => {
    switch (status) {
      case 'conforme':
        return 'Conforme';
      case 'non_conforme':
        return 'Non conforme';
      case 'en_attente':
        return 'En attente';
      default:
        return status;
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Date d'inspection</TableHead>
            <TableHead>Opérateur</TableHead>
            <TableHead>Lieu</TableHead>
            <TableHead>Inspecteurs</TableHead>
            <TableHead>Résultat</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInspections.length > 0 ? (
            filteredInspections.map((inspection) => {
              const dossier = dossiers.find(d => d.id === inspection.dossierId);
              const isPast = new Date(inspection.dateInspection) < new Date();
              const canUpdate = isPast && inspection.resultat === 'en_attente' && 
                             (currentUser?.role === 'inspecteur' || currentUser?.role === 'chef_mission');
              
              return (
                <TableRow key={inspection.id}>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="mr-2 text-gray-500" size={16} />
                      {new Date(inspection.dateInspection).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{dossier?.operateurNom}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="mr-1 text-gray-500" size={16} />
                      {inspection.lieu}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="mr-1 text-gray-500" size={16} />
                      {inspection.inspecteurs.join(', ')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(inspection.resultat)}>
                      {formatStatus(inspection.resultat)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {canUpdate && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => handleMarkAsConforme(inspection.id)}
                          >
                            Conforme
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleMarkAsNonConforme(inspection.id)}
                          >
                            Non conforme
                          </Button>
                        </>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(inspection.id)}
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
              <TableCell colSpan={6} className="h-24 text-center">
                Aucune inspection trouvée
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InspectionsTable;
