
import React from 'react';
import { Input } from '@/components/ui/input';
import { Dossier } from '@/types';

interface DossierDateFieldsProps {
  newDossier: Omit<Dossier, 'id'>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const DossierDateFields = ({ newDossier, handleInputChange }: DossierDateFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="dateTransmission" className="text-right font-medium text-sm">
          Date de transmission
        </label>
        <Input
          id="dateTransmission"
          name="dateTransmission"
          type="date"
          value={newDossier.dateTransmission}
          onChange={handleInputChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="delai" className="text-right font-medium text-sm">
          Délai (jours)
        </label>
        <Input
          id="delai"
          name="delai"
          type="number"
          value={newDossier.delai}
          onChange={handleInputChange}
          className="col-span-3"
          min={1}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="dateButoir" className="text-right font-medium text-sm">
          Date butoir
        </label>
        <Input
          id="dateButoir"
          name="dateButoir"
          type="date"
          value={newDossier.dateButoir}
          readOnly
          className="col-span-3 bg-gray-50"
        />
      </div>
    </>
  );
};

export default DossierDateFields;
