
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface EntrepriseInfoFormProps {
  entreprise: string;
  promoteur: string;
  telephone: string;
  produits: string;
  email: string;
  adresse: string;
  onEntrepriseChange: (value: string) => void;
  onPromoteurChange: (value: string) => void;
  onTelephoneChange: (value: string) => void;
  onProduitsChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onAdresseChange: (value: string) => void;
}

const EntrepriseInfoForm: React.FC<EntrepriseInfoFormProps> = ({
  entreprise,
  promoteur,
  telephone,
  produits,
  email,
  adresse,
  onEntrepriseChange,
  onPromoteurChange,
  onTelephoneChange,
  onProduitsChange,
  onEmailChange,
  onAdresseChange
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4 text-certif-blue">Informations du demandeur</h3>
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
          <Label htmlFor="email">Email de contact</Label>
          <Input 
            id="email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="Adresse email"
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="adresse">Adresse complète</Label>
          <Input 
            id="adresse"
            value={adresse}
            onChange={(e) => onAdresseChange(e.target.value)}
            placeholder="Adresse complète de l'entreprise"
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="produits">Produits à certifier *</Label>
          <Textarea 
            id="produits"
            value={produits}
            onChange={(e) => onProduitsChange(e.target.value)}
            placeholder="Liste détaillée des produits à certifier"
            required
            className="min-h-[100px]"
          />
        </div>
      </div>
    </div>
  );
};

export default EntrepriseInfoForm;
