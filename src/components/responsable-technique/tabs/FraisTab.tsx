
import React from 'react';
import { Check } from 'lucide-react';
import FraisValidationTable from '../frais/FraisValidationTable';
import { NoteFrais } from '@/types';

interface FraisTabProps {
  notesFrais: NoteFrais[];
  onValidate: (id: string) => void;
}

const FraisTab: React.FC<FraisTabProps> = ({ notesFrais, onValidate }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Check className="h-5 w-5 mr-2 text-certif-blue" />
        Validation des frais acquittés
      </h2>
      <FraisValidationTable 
        frais={notesFrais}
        onValidate={onValidate}
      />
    </div>
  );
};

export default FraisTab;
