
import React from 'react';
import { Users } from 'lucide-react';
import { MembreComite } from '@/types';
import MembreComiteCard from './MembreComiteCard';

interface MembresComiteListProps {
  membres: MembreComite[];
  onRemoveMembre: (id: string) => void;
}

const MembresComiteList: React.FC<MembresComiteListProps> = ({ membres, onRemoveMembre }) => {
  if (!membres.length) return null;

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h4 className="text-md font-medium mb-4 flex items-center">
        <Users className="h-5 w-5 mr-2 text-certif-blue" />
        Membres du pilote technique ({membres.length})
      </h4>
      <div className="grid gap-4 md:grid-cols-2">
        {membres.map(membre => (
          <MembreComiteCard 
            key={membre.id} 
            membre={membre} 
            onRemove={onRemoveMembre} 
          />
        ))}
      </div>
    </div>
  );
};

export default MembresComiteList;
