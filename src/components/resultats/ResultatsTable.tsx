
import React from 'react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import { Certificat } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AlertCircle, DownloadCloud, FileText } from 'lucide-react';
import DossierDetailsDialog from '../dossiers/DossierDetailsDialog';

interface ResultatsTableProps {
  filteredCertificats: Certificat[];
  canCreateDocuments: boolean;
  handleSuspendCertificat: (id: string) => void;
  handleReactivateCertificat: (id: string) => void;
  handleDownloadCertificat: (certificat: Certificat) => void;
}

const ResultatsTable: React.FC<ResultatsTableProps> = ({
  filteredCertificats,
  canCreateDocuments,
  handleSuspendCertificat,
  handleReactivateCertificat,
  handleDownloadCertificat,
}) => {
  // Vérifier si un certificat est proche de l'expiration (moins de 30 jours)
  const isNearExpiration = (dateExpiration: string) => {
    const now = new Date();
    const expiration = new Date(dateExpiration);
    const diffTime = expiration.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 30 && diffDays > 0;
  };

  // Fonction pour obtenir la couleur du badge en fonction du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'actif':
        return 'bg-green-500 text-white';
      case 'suspendu':
        return 'bg-yellow-500 text-white';
      case 'retire':
        return 'bg-red-500 text-white';
      case 'expire':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Fonction pour formater le statut pour l'affichage
  const formatStatus = (status: string) => {
    switch (status) {
      case 'actif':
        return 'Actif';
      case 'suspendu':
        return 'Suspendu';
      case 'retire':
        return 'Retiré';
      case 'expire':
        return 'Expiré';
      default:
        return status;
    }
  };

  const getResultTypeLabel = (numero: string) => {
    if (numero.startsWith('CERT')) return 'Certificat';
    if (numero.startsWith('NC')) return 'Non-conformité';
    if (numero.startsWith('AC')) return 'Actions correctives';
    return 'Document';
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Numéro</TableHead>
            <TableHead>Entreprise</TableHead>
            <TableHead>Produit</TableHead>
            <TableHead>Date d'émission</TableHead>
            <TableHead>Date limite/expiration</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCertificats.length > 0 ? (
            filteredCertificats.map((certificat) => (
              <TableRow key={certificat.id}>
                <TableCell>{getResultTypeLabel(certificat.numero)}</TableCell>
                <TableCell className="font-mono">{certificat.numero}</TableCell>
                <TableCell className="font-medium">{certificat.entreprise}</TableCell>
                <TableCell>{certificat.produit}</TableCell>
                <TableCell>{new Date(certificat.dateDelivrance).toLocaleDateString()}</TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center">
                    {isNearExpiration(certificat.dateExpiration) && (
                      <AlertCircle className="mr-1 text-yellow-500" size={16} />
                    )}
                    {new Date(certificat.dateExpiration).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(certificat.status)}>
                    {formatStatus(certificat.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <DossierDetailsDialog dossierId={certificat.dossierId} />
                    
                    {certificat.status === 'actif' && canCreateDocuments && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                        onClick={() => handleSuspendCertificat(certificat.id)}
                      >
                        Suspendre
                      </Button>
                    )}
                    {certificat.status === 'suspendu' && canCreateDocuments && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        onClick={() => handleReactivateCertificat(certificat.id)}
                      >
                        Réactiver
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleDownloadCertificat(certificat)}
                    >
                      <DownloadCloud size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                Aucun document trouvé
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ResultatsTable;
