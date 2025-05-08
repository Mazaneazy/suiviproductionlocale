
import React from 'react';
import { FileText } from 'lucide-react';
import RapportsTable from '../rapports/RapportsTable';
import { RapportInspection } from '@/types';

interface RapportsTabProps {
  rapports: RapportInspection[];
  onViewRapport: (rapport: RapportInspection) => void;
}

const RapportsTab: React.FC<RapportsTabProps> = ({ rapports, onViewRapport }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <FileText className="h-5 w-5 mr-2 text-certif-blue" />
        Rapports d'inspection et d'analyse
      </h2>
      <RapportsTable 
        rapports={rapports}
        onViewRapport={onViewRapport}
      />
    </div>
  );
};

export default RapportsTab;
