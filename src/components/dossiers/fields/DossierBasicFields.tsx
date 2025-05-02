
import React from 'react';
import { Input } from '@/components/ui/input';
import { Dossier } from '@/types';

interface DossierBasicFieldsProps {
  newDossier: Omit<Dossier, 'id'>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const DossierBasicFields = ({ newDossier, handleInputChange }: DossierBasicFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="operateurNom" className="text-right font-medium text-sm">
          Opérateur*
        </label>
        <Input
          id="operateurNom"
          name="operateurNom"
          value={newDossier.operateurNom}
          onChange={handleInputChange}
          className="col-span-3"
          placeholder="Nom de l'entreprise"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="promoteurNom" className="text-right font-medium text-sm">
          Promoteur*
        </label>
        <Input
          id="promoteurNom"
          name="promoteurNom"
          value={newDossier.promoteurNom || ''}
          onChange={handleInputChange}
          className="col-span-3"
          placeholder="Nom du promoteur"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="telephone" className="text-right font-medium text-sm">
          Téléphone*
        </label>
        <Input
          id="telephone"
          name="telephone"
          value={newDossier.telephone || ''}
          onChange={handleInputChange}
          className="col-span-3"
          placeholder="Numéro de téléphone"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="typeProduit" className="text-right font-medium text-sm">
          Type de produit*
        </label>
        <Input
          id="typeProduit"
          name="typeProduit"
          value={newDossier.typeProduit}
          onChange={handleInputChange}
          className="col-span-3"
          placeholder="Type de produit"
        />
      </div>
    </>
  );
};

export default DossierBasicFields;
