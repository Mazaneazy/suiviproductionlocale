
import React from 'react';
import { User, Award } from 'lucide-react';

interface MembreAvatarProps {
  isChef: boolean;
}

const MembreAvatar: React.FC<MembreAvatarProps> = ({ isChef }) => {
  const avatarClass = isChef ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600';
  
  return (
    <div className={`rounded-full p-2 mr-3 ${avatarClass}`}>
      {isChef ? <Award className="h-5 w-5" /> : <User className="h-5 w-5" />}
    </div>
  );
};

export default MembreAvatar;
