
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MembreComite } from '@/types';
import { User, UserX, Award } from 'lucide-react';

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
  // Déterminer l'icône et la couleur en fonction du rôle
  const getRoleBadge = () => {
    switch (membre.role) {
      case 'chef':
        return (
          <Badge className="bg-amber-500 text-white">
            <Award className="h-3 w-3 mr-1" />
            Chef du comité
          </Badge>
        );
      case 'inspecteur':
        return <Badge className="bg-blue-500 text-white">Inspecteur</Badge>;
      case 'analyste':
        return <Badge className="bg-green-500 text-white">Analyste</Badge>;
      case 'expert':
        return <Badge className="bg-purple-500 text-white">Expert technique</Badge>;
      default:
        return <Badge>Membre</Badge>;
    }
  };

  return (
    <div className={`p-3 rounded-lg border flex items-center justify-between ${isChef ? 'border-amber-300 bg-amber-50' : 'border-gray-200'}`}>
      <div className="flex items-center">
        <div className={`rounded-full p-2 mr-3 ${isChef ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600'}`}>
          {isChef ? <Award className="h-5 w-5" /> : <User className="h-5 w-5" />}
        </div>
        <div>
          <div className="font-medium">{membre.nom}</div>
          <div className="flex items-center space-x-2 mt-1">
            {getRoleBadge()}
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
