
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import { useParametresEvaluation } from '@/hooks/useParametresEvaluation';

interface ParametresAnalyseFormProps {
  selectedParametres: string[];
  onChange: (parametres: string[]) => void;
}

const ParametresAnalyseForm: React.FC<ParametresAnalyseFormProps> = ({
  selectedParametres,
  onChange
}) => {
  const { parametresOptions } = useParametresEvaluation();
  const [customParametre, setCustomParametre] = React.useState('');
  
  const handleToggleParametre = (parametre: string) => {
    if (selectedParametres.includes(parametre)) {
      onChange(selectedParametres.filter(p => p !== parametre));
    } else {
      onChange([...selectedParametres, parametre]);
    }
  };
  
  const handleAddCustomParametre = () => {
    if (customParametre.trim() && !selectedParametres.includes(customParametre.trim())) {
      onChange([...selectedParametres, customParametre.trim()]);
      setCustomParametre('');
    }
  };
  
  const handleRemoveParametre = (parametre: string) => {
    onChange(selectedParametres.filter(p => p !== parametre));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Paramètres à analyser au laboratoire</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {parametresOptions.map((parametre) => (
              <div key={parametre} className="flex items-center space-x-2">
                <Checkbox 
                  id={`param-${parametre}`}
                  checked={selectedParametres.includes(parametre)}
                  onCheckedChange={() => handleToggleParametre(parametre)}
                />
                <Label htmlFor={`param-${parametre}`} className="text-sm cursor-pointer">
                  {parametre}
                </Label>
              </div>
            ))}
          </div>
          
          <div className="flex items-center space-x-2 pt-4">
            <Input
              placeholder="Ajouter un paramètre personnalisé"
              value={customParametre}
              onChange={(e) => setCustomParametre(e.target.value)}
              className="flex-1"
            />
            <Button type="button" onClick={handleAddCustomParametre} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </div>
          
          {selectedParametres.length > 0 && (
            <div className="pt-4">
              <h4 className="text-sm font-medium mb-2">Paramètres sélectionnés:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedParametres.map(parametre => (
                  <div 
                    key={parametre}
                    className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md flex items-center gap-1 text-xs"
                  >
                    {parametre}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveParametre(parametre)}
                      className="text-blue-400 hover:text-blue-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ParametresAnalyseForm;
