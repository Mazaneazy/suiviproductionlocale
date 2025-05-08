
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface EntrepriseInfoFormProps {
  entreprise: string;
  promoteur: string;
  telephone: string;
  produits: string;
  onEntrepriseChange: (value: string) => void;
  onPromoteurChange: (value: string) => void;
  onTelephoneChange: (value: string) => void;
  onProduitsChange: (value: string) => void;
}

const EntrepriseInfoForm: React.FC<EntrepriseInfoFormProps> = ({
  entreprise,
  promoteur,
  telephone,
  produits,
  onEntrepriseChange,
  onPromoteurChange,
  onTelephoneChange,
  onProduitsChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="entreprise">Nom de l'entreprise *</Label>
        <Input 
          id="entreprise"
          value={entreprise}
          onChange={(e) => onEntrepriseChange(e.target.value)}
          placeholder="Nom de l'entreprise"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="promoteur">Nom du promoteur *</Label>
        <Input 
          id="promoteur"
          value={promoteur}
          onChange={(e) => onPromoteurChange(e.target.value)}
          placeholder="Nom du promoteur"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="telephone">Téléphone *</Label>
        <Input 
          id="telephone"
          type="tel"
          value={telephone}
          onChange={(e) => onTelephoneChange(e.target.value)}
          placeholder="Numéro de téléphone"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="produits">Produits à certifier *</Label>
        <Textarea 
          id="produits"
          value={produits}
          onChange={(e) => onProduitsChange(e.target.value)}
          placeholder="Liste des produits à certifier"
          required
        />
      </div>
    </div>
  );
};

export default EntrepriseInfoForm;
