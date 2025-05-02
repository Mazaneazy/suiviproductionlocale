
import React from 'react';
import { Dossier } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DossierStatusFieldProps {
  status: string;
  onStatusChange: (value: "complet" | "en_attente" | "rejete" | "en_cours" | "certifie" | "a_corriger") => void;
}

const DossierStatusField = ({ status, onStatusChange }: DossierStatusFieldProps) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <label htmlFor="status" className="text-right font-medium text-sm">
        Statut
      </label>
      <Select
        value={status}
        onValueChange={(value: "complet" | "en_attente" | "rejete" | "en_cours" | "certifie" | "a_corriger") => 
          onStatusChange(value)
        }
      >
        <SelectTrigger className="col-span-3">
          <SelectValue placeholder="Sélectionner un statut" />
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
  );
};

export default DossierStatusField;
