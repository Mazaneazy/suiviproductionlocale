
import React from 'react';
import { Clock } from 'lucide-react';

const EmptyActivityState: React.FC = () => {
  return (
    <div className="text-center py-8 text-gray-500">
      <Clock className="mx-auto h-10 w-10 text-gray-400 mb-2" />
      <p>Aucune action enregistrée pour cet utilisateur</p>
    </div>
  );
};

export default EmptyActivityState;
