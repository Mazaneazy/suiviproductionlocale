
import React from 'react';
import { Clock } from 'lucide-react';

const EmptyActivityState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-gray-500">
      <Clock className="h-10 w-10 text-gray-400 mb-3" />
      <p className="text-center">Aucune action enregistrée pour cet utilisateur</p>
      <p className="text-sm text-gray-400">Les actions récentes apparaîtront ici</p>
    </div>
  );
};

export default EmptyActivityState;
