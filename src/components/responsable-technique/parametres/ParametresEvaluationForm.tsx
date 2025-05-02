
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ParametreOption from './ParametreOption';

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
            <ParametreOption
              key={parametre}
              parametre={parametre}
              isSelected={selectedParametres.includes(parametre)}
              onToggle={handleToggleParametre}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ParametresEvaluationForm;
