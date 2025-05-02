
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Dossier } from '@/types';
import { FileText, Calendar, Clock, User } from 'lucide-react';

interface DossierHeaderProps {
  dossier: Dossier;
}

const DossierHeader: React.FC<DossierHeaderProps> = ({ dossier }) => {
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

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <div className="flex items-center">
        <User className="mr-2 text-gray-400" size={16} />
        <span className="font-medium mr-1">Promoteur:</span> {dossier.promoteurNom}
      </div>
      <div className="flex items-center">
        <FileText className="mr-2 text-gray-400" size={16} />
        <span className="font-medium mr-1">Produit:</span> {dossier.typeProduit}
      </div>
      <div className="flex items-center">
        <Calendar className="mr-2 text-gray-400" size={16} />
        <span className="font-medium mr-1">Date transmission:</span> {new Date(dossier.dateTransmission).toLocaleDateString()}
      </div>
      <div className="flex items-center">
        <Clock className="mr-2 text-gray-400" size={16} />
        <span className="font-medium mr-1">Date butoir:</span> {new Date(dossier.dateButoir).toLocaleDateString()}
      </div>
      <div className="flex items-center">
        <Badge className={getStatusColor(dossier.status)}>
          {formatStatus(dossier.status)}
        </Badge>
      </div>
    </div>
  );
};

export default DossierHeader;
