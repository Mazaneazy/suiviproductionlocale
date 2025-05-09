
import React from 'react';
import { Award } from 'lucide-react';
import { MembreComite } from '@/types';
import MembreComiteCard from './MembreComiteCard';

interface ChefComiteSectionProps {
  chefComite: MembreComite | null;
}

const ChefComiteSection: React.FC<ChefComiteSectionProps> = ({ chefComite }) => {
  if (!chefComite) return null;

  return (
    <div className="bg-certif-lightblue p-4 rounded-lg border border-certif-blue">
      <h4 className="text-md font-medium mb-4 flex items-center">
        <Award className="h-5 w-5 mr-2 text-certif-blue" />
        Chef du comité
      </h4>
      <MembreComiteCard membre={chefComite} isChef={true} />
    </div>
  );
};

export default ChefComiteSection;
