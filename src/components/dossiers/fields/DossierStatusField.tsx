
import React from 'react';
import { Dossier } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface DossierStatusFieldProps {
  status: string;
  onStatusChange: (value: "complet" | "en_attente" | "rejete" | "en_cours" | "certifie" | "a_corriger") => void;
}

const DossierStatusField = ({ status, onStatusChange }: DossierStatusFieldProps) => {
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

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <label htmlFor="status" className="text-right font-medium text-sm">
        Statut
      </label>
      <div className="col-span-3">
        <Select
          value={status}
          onValueChange={(value: "complet" | "en_attente" | "rejete" | "en_cours" | "certifie" | "a_corriger") => 
            onStatusChange(value)
          }
        >
          <SelectTrigger>
            <SelectValue>
              <Badge className={`${getStatusColor(status)} px-2 py-1`}>
                {formatStatus(status)}
              </Badge>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en_attente">En attente</SelectItem>
            <SelectItem value="complet">Complet</SelectItem>
            <SelectItem value="en_cours">En cours</SelectItem>
            <SelectItem value="rejete">Rejeté</SelectItem>
            <SelectItem value="certifie">Certifié</SelectItem>
            <SelectItem value="a_corriger">À corriger</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DossierStatusField;
