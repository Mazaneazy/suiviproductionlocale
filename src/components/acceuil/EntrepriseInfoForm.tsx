
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
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-4 text-certif-blue flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        Informations du demandeur
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="entreprise" className="text-sm font-medium">
            Nom de l'entreprise <span className="text-red-500">*</span>
          </Label>
          <Input 
            id="entreprise"
            value={entreprise}
            onChange={(e) => onEntrepriseChange(e.target.value)}
            placeholder="Nom de l'entreprise"
            className="border-gray-300"
          />
          <p className="text-xs text-gray-500">Ce nom doit être unique dans le système</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="promoteur" className="text-sm font-medium">
            Nom du promoteur <span className="text-red-500">*</span>
          </Label>
          <Input 
            id="promoteur"
            value={promoteur}
            onChange={(e) => onPromoteurChange(e.target.value)}
            placeholder="Nom du promoteur"
            className="border-gray-300"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="telephone" className="text-sm font-medium">
            Téléphone <span className="text-red-500">*</span>
          </Label>
          <Input 
            id="telephone"
            type="tel"
            value={telephone}
            onChange={(e) => onTelephoneChange(e.target.value)}
            placeholder="Numéro de téléphone"
            className="border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email de contact
          </Label>
          <Input 
            id="email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="Adresse email"
            className="border-gray-300"
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="adresse" className="text-sm font-medium">
            Adresse complète
          </Label>
          <Input 
            id="adresse"
            value={adresse}
            onChange={(e) => onAdresseChange(e.target.value)}
            placeholder="Adresse complète de l'entreprise"
            className="border-gray-300"
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="produits" className="text-sm font-medium">
            Produits à certifier <span className="text-red-500">*</span>
          </Label>
          <Textarea 
            id="produits"
            value={produits}
            onChange={(e) => onProduitsChange(e.target.value)}
            placeholder="Liste détaillée des produits à certifier"
            className="min-h-[100px] border-gray-300"
          />
        </div>
      </div>
    </div>
  );
};

export default EntrepriseInfoForm;
