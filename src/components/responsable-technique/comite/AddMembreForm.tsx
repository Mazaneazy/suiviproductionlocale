
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { UserPlus } from 'lucide-react';
import { ROLES_COMITE } from './comiteConstants';

interface AddMembreFormProps {
  nouveauMembre: {
    nom: string;
    role: 'chef' | 'inspecteur' | 'analyste' | 'expert';
    specialite: string;
  };
  onMembreChange: (field: string, value: string) => void;
  onAddMembre: () => void;
}

const AddMembreForm: React.FC<AddMembreFormProps> = ({ 
  nouveauMembre, 
  onMembreChange, 
  onAddMembre 
}) => {
  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <UserPlus className="h-5 w-5 mr-2 text-certif-blue" />
        Ajouter un membre au comité
      </h3>
      
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom du membre</Label>
            <Input 
              id="nom"
              value={nouveauMembre.nom}
              onChange={(e) => onMembreChange('nom', e.target.value)}
              placeholder="Nom complet"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <Select 
              value={nouveauMembre.role}
              onValueChange={(value: 'chef' | 'inspecteur' | 'analyste' | 'expert') => 
                onMembreChange('role', value)
              }
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                {ROLES_COMITE.map(role => (
                  <SelectItem key={role.value} value={role.value} className="flex items-center">
                    <div className="flex items-center">
                      {role.icon}
                      <span className="ml-2">{role.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialite">Spécialité (optionnel)</Label>
            <Input 
              id="specialite"
              value={nouveauMembre.specialite}
              onChange={(e) => onMembreChange('specialite', e.target.value)}
              placeholder="Ex: Chimie analytique"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={onAddMembre} 
            variant="outline" 
            className="flex items-center"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Ajouter le membre
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddMembreForm;
