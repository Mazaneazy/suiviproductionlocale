
import React from 'react';
import { Button } from "@/components/ui/button";
import { MembreComite } from '@/types';
import { UserX } from 'lucide-react';
import { getRoleBadge, getMembreAvatarStyles } from './comiteUtils';
import MembreAvatar from './MembreAvatar';

interface MembreComiteCardProps {
  membre: MembreComite;
  isChef?: boolean;
  onRemove?: (id: string) => void;
}

const MembreComiteCard: React.FC<MembreComiteCardProps> = ({ 
  membre, 
  isChef = false,
  onRemove 
}) => {
  const { containerClass } = getMembreAvatarStyles(isChef);

  return (
    <div className={`p-3 rounded-lg border flex items-center justify-between ${containerClass}`}>
      <div className="flex items-center">
        <MembreAvatar isChef={isChef} />
        <div>
          <div className="font-medium">{membre.nom}</div>
          <div className="flex items-center space-x-2 mt-1">
            {getRoleBadge(membre.role)}
            {membre.specialite && (
              <span className="text-xs text-gray-500">{membre.specialite}</span>
            )}
          </div>
        </div>
      </div>
      
      {onRemove && !isChef && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-2 h-8 w-8 p-0"
          onClick={() => onRemove(membre.id)}
        >
          <UserX className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default MembreComiteCard;
