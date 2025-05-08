
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import ParametreOption from './ParametreOption';

interface Parametre {
  nom: string;
  prix: number;
}

interface ParametresEvaluationSectionProps {
  parametres: Parametre[];
  selectedParametres: string[];
  onAddParametre: (parametre: Parametre) => void;
  onRemoveParametre: (index: number) => void;
  onToggleParametre: (parametre: string) => void;
}

const ParametresEvaluationSection: React.FC<ParametresEvaluationSectionProps> = ({
  parametres,
  selectedParametres,
  onAddParametre,
  onRemoveParametre,
  onToggleParametre
}) => {
  const [nouveauParametre, setNouveauParametre] = useState<Parametre>({
    nom: '',
    prix: 0
  });

  const handleAddParametre = () => {
    if (nouveauParametre.nom.trim() && nouveauParametre.prix > 0) {
      onAddParametre(nouveauParametre);
      setNouveauParametre({ nom: '', prix: 0 });
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-certif-blue">Paramètres à évaluer</h3>

      {/* Liste des paramètres existants */}
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {parametres.map((parametre, index) => (
            <Card key={index} className="p-4 flex flex-col justify-between">
              <div>
                <h4 className="font-medium">{parametre.nom}</h4>
                <div className="text-sm text-gray-500 mt-1">
                  Prix: {parametre.prix.toLocaleString()} FCFA
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <ParametreOption
                  parametre={parametre.nom}
                  isSelected={selectedParametres.includes(parametre.nom)}
                  onToggle={onToggleParametre}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => onRemoveParametre(index)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Formulaire pour ajouter un nouveau paramètre */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nom">Nom du paramètre</Label>
          <Input
            id="nom"
            value={nouveauParametre.nom}
            onChange={(e) => setNouveauParametre({ ...nouveauParametre, nom: e.target.value })}
            placeholder="Ex: pH, Viscosité..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="prix">Prix (FCFA)</Label>
          <Input
            id="prix"
            type="number"
            value={nouveauParametre.prix}
            onChange={(e) => setNouveauParametre({ ...nouveauParametre, prix: Number(e.target.value) })}
            placeholder="0"
          />
        </div>
        <div className="flex items-end">
          <Button
            type="button"
            onClick={handleAddParametre}
            disabled={!nouveauParametre.nom.trim() || nouveauParametre.prix <= 0}
          >
            <Plus className="mr-2" size={16} />
            Ajouter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ParametresEvaluationSection;
