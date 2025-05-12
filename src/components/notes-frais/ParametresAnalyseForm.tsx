
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ParametresAnalyseFormProps {
  selectedParametres: string[];
  onChange: (selected: string[]) => void;
}

const ParametresAnalyseForm: React.FC<ParametresAnalyseFormProps> = ({
  selectedParametres,
  onChange
}) => {
  const parametresOptions = [
    'pH',
    'Viscosité',
    'Densité',
    'Point d\'éclair',
    'Teneur en eau',
    'Résistance à la traction',
  ];

  const handleToggleParametre = (parametre: string) => {
    let newSelectedParametres: string[];
    
    if (selectedParametres.includes(parametre)) {
      newSelectedParametres = selectedParametres.filter(p => p !== parametre);
    } else {
      newSelectedParametres = [...selectedParametres, parametre];
    }
    
    onChange(newSelectedParametres);
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Paramètres d'analyse</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-gray-500">
          Sélectionnez les paramètres à évaluer pour ce dossier.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {parametresOptions.map((parametre) => (
            <div key={parametre} className="flex items-center space-x-2">
              <Checkbox 
                id={`param-${parametre}`}
                checked={selectedParametres.includes(parametre)}
                onCheckedChange={() => handleToggleParametre(parametre)}
              />
              <Label 
                htmlFor={`param-${parametre}`}
                className="text-sm cursor-pointer"
              >
                {parametre}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ParametresAnalyseForm;
