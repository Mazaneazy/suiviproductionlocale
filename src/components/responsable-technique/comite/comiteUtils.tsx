
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Award } from 'lucide-react';

// Function to get the appropriate badge for a role
export const getRoleBadge = (role: 'chef' | 'inspecteur' | 'analyste' | 'expert') => {
  switch (role) {
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

// Function to get avatar styles based on role
export const getMembreAvatarStyles = (isChef: boolean) => {
  return {
    containerClass: isChef ? 'border-amber-300 bg-amber-50' : 'border-gray-200',
    avatarClass: isChef ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600'
  };
};
