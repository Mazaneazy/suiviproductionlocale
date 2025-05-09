
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard } from 'lucide-react';

interface NotesFraisFiltersProps {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const NotesFraisFilters: React.FC<NotesFraisFiltersProps> = ({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusChange
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Input
          placeholder="Rechercher par nom d'opérateur..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      </div>
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrer par statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tous">Tous les statuts</SelectItem>
          <SelectItem value="en_attente">En attente</SelectItem>
          <SelectItem value="valide">Validée</SelectItem>
          <SelectItem value="rejete">Rejetée</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default NotesFraisFilters;
