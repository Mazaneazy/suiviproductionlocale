
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ParametresEvaluationFormProps {
  parametresOptions: string[];
  selectedParametres: string[];
  onChange: (selected: string[]) => void;
}

const ParametresEvaluationForm: React.FC<ParametresEvaluationFormProps> = ({
  parametresOptions,
  selectedParametres,
  onChange
}) => {
  const handleToggleParametre = (parametre: string) => {
    if (selectedParametres.includes(parametre)) {
      onChange(selectedParametres.filter(p => p !== parametre));
    } else {
      onChange([...selectedParametres, parametre]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Paramètres d'évaluation</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-gray-600">
          Sélectionnez les paramètres à évaluer pour ce dossier selon les normes camerounaises applicables.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {parametresOptions.map((parametre) => (
            <div key={parametre} className="flex items-center space-x-2">
              <Checkbox 
                id={parametre}
                checked={selectedParametres.includes(parametre)}
                onCheckedChange={() => handleToggleParametre(parametre)}
              />
              <Label htmlFor={parametre} className="text-sm cursor-pointer">
                {parametre}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ParametresEvaluationForm;
