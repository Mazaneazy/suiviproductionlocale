
import React from 'react';
import { Input } from '@/components/ui/input';
import { FileCheck, Calendar } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ResultatsFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

const ResultatsFilter: React.FC<ResultatsFilterProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Input
          placeholder="Rechercher par entreprise, produit ou numéro..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <FileCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      </div>
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrer par statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tous">Tous les statuts</SelectItem>
          <SelectItem value="actif">Actif</SelectItem>
          <SelectItem value="suspendu">Suspendu</SelectItem>
          <SelectItem value="retire">Retiré</SelectItem>
          <SelectItem value="expire">Expiré</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ResultatsFilter;
