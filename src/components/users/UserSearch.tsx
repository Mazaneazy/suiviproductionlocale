
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface UserSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="mb-4 relative">
      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      <Input
        placeholder="Rechercher par nom, email ou rôle..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

export default UserSearch;
