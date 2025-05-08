
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, ListFilter } from 'lucide-react';

interface DocumentFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
}

const DocumentFilters: React.FC<DocumentFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter
}) => {
  const documentTypes = [
    { value: 'tous', label: 'Tous les types' },
    { value: 'registre_commerce', label: 'Registre de Commerce' },
    { value: 'carte_contribuable', label: 'Carte de Contribuable' },
    { value: 'processus_production', label: 'Processus de production' },
    { value: 'certificats_conformite', label: 'Certificats' },
    { value: 'liste_personnel', label: 'Liste du personnel' },
    { value: 'plan_localisation', label: 'Plan de localisation' },
    { value: 'pdf', label: 'Autres documents' }
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Rechercher un document..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>
      <div className="flex items-center gap-2">
        <ListFilter className="h-4 w-4 text-gray-400" />
        <select 
          className="border rounded px-2 py-2 text-sm"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          {documentTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DocumentFilters;
