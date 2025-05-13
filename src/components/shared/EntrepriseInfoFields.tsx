
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Grid } from '@/components/ui/grid';

interface EntrepriseInfoFieldsProps {
  operateurNom: string;
  operateurEmail?: string;
  operateurTelephone?: string;
  promoteurNom?: string;
  onChange: (field: string, value: string) => void;
  disabled?: boolean;
  required?: boolean;
}

const EntrepriseInfoFields: React.FC<EntrepriseInfoFieldsProps> = ({
  operateurNom,
  operateurEmail,
  operateurTelephone,
  promoteurNom,
  onChange,
  disabled = false,
  required = true
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="operateurNom">
          Nom de l'entreprise {required && <span className="text-red-500">*</span>}
        </Label>
        <Input
          id="operateurNom"
          name="operateurNom"
          value={operateurNom}
          onChange={(e) => onChange('operateurNom', e.target.value)}
          disabled={disabled}
          placeholder="Raison sociale de l'entreprise"
          required={required}
        />
      </div>
      
      {promoteurNom !== undefined && (
        <div className="space-y-2">
          <Label htmlFor="promoteurNom">
            Nom du promoteur {required && <span className="text-red-500">*</span>}
          </Label>
          <Input
            id="promoteurNom"
            name="promoteurNom"
            value={promoteurNom}
            onChange={(e) => onChange('promoteurNom', e.target.value)}
            disabled={disabled}
            placeholder="Nom complet du promoteur"
            required={required}
          />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {operateurEmail !== undefined && (
          <div className="space-y-2">
            <Label htmlFor="operateurEmail">
              Email de contact
            </Label>
            <Input
              id="operateurEmail"
              name="operateurEmail"
              type="email"
              value={operateurEmail}
              onChange={(e) => onChange('operateurEmail', e.target.value)}
              disabled={disabled}
              placeholder="email@exemple.com"
            />
          </div>
        )}
        
        {operateurTelephone !== undefined && (
          <div className="space-y-2">
            <Label htmlFor="operateurTelephone">
              Téléphone {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="operateurTelephone"
              name="operateurTelephone"
              value={operateurTelephone}
              onChange={(e) => onChange('operateurTelephone', e.target.value)}
              disabled={disabled}
              placeholder="+237 6XX XXX XXX"
              required={required}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EntrepriseInfoFields;
