
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Dossier } from '@/types';

interface DossierFormProps {
  newDossier: Omit<Dossier, 'id'>;
  setNewDossier: React.Dispatch<React.SetStateAction<Omit<Dossier, 'id'>>>;
  onSubmit: () => void;
  onCancel: () => void;
}

const DossierForm = ({ newDossier, setNewDossier, onSubmit, onCancel }: DossierFormProps) => {
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // If the délai is modified, recalculate the date butoir
    if (name === 'delai') {
      const delaiValue = parseInt(value) || 0;
      const dateTransmission = new Date(newDossier.dateTransmission);
      const dateButoir = new Date(dateTransmission);
      dateButoir.setDate(dateTransmission.getDate() + delaiValue);
      
      setNewDossier({
        ...newDossier,
        [name]: delaiValue,
        dateButoir: dateButoir.toISOString().split('T')[0],
      });
    }
    // If the date de transmission is modified, recalculate the date butoir
    else if (name === 'dateTransmission') {
      const dateTransmission = new Date(value);
      const dateButoir = new Date(dateTransmission);
      dateButoir.setDate(dateTransmission.getDate() + newDossier.delai);
      
      setNewDossier({
        ...newDossier,
        [name]: value,
        dateButoir: dateButoir.toISOString().split('T')[0],
      });
    }
    else {
      setNewDossier({
        ...newDossier,
        [name]: value,
      });
    }
  };

  const handleAddDossier = () => {
    // Vérifier que tous les champs obligatoires sont remplis
    if (!newDossier.operateurNom || !newDossier.typeProduit) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
      });
      return;
    }
    
    onSubmit();
  };

  return (
    <div className="grid gap-4 py-4">
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
    </div>
  );
};

export default DossierForm;
