
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Users, MapPin } from 'lucide-react';
import { useInspectionForm } from '@/hooks/useInspectionForm';

interface ProgrammerInspectionFormProps {
  dossierId: string;
  onSuccess?: () => void;
}

const ProgrammerInspectionForm: React.FC<ProgrammerInspectionFormProps> = ({ dossierId, onSuccess }) => {
  const {
    formData,
    inspecteurs,
    handleChange,
    handleInspecteurChange,
    addInspecteur,
    removeInspecteur,
    handleSubmit,
  } = useInspectionForm(dossierId);

  const onSubmitWrapper = (e: React.FormEvent) => {
    handleSubmit(e);
    if (onSuccess) {
      onSuccess();
    }
  };

  console.log('Available inspectors:', inspecteurs);
  console.log('Selected inspectors:', formData.inspecteurs);

  return (
    <form onSubmit={onSubmitWrapper} className="space-y-4">
      <div>
        <label htmlFor="dateInspection" className="block text-sm font-medium text-gray-700 mb-1">
          Date d'inspection
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <Input
            id="dateInspection"
            name="dateInspection"
            type="date"
            value={formData.dateInspection}
            onChange={handleChange}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="lieu" className="block text-sm font-medium text-gray-700 mb-1">
          Lieu de l'inspection
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <Input
            id="lieu"
            name="lieu"
            value={formData.lieu}
            onChange={handleChange}
            placeholder="Ex: Siège de l'entreprise, Usine de production..."
            className="pl-10"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Inspecteurs assignés
        </label>
        {formData.inspecteurs.map((inspecteur, index) => (
          <div key={index} className="flex items-center mb-2">
            <div className="relative flex-1">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <Select 
                value={inspecteur} 
                onValueChange={(value) => handleInspecteurChange(index, value)}
              >
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Sélectionner un inspecteur" />
                </SelectTrigger>
                <SelectContent>
                  {inspecteurs.map((insp) => (
                    <SelectItem key={insp.value} value={insp.value}>
                      {insp.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {formData.inspecteurs.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeInspecteur(index)}
                className="ml-2"
              >
                Supprimer
              </Button>
            )}
          </div>
        ))}
        {formData.inspecteurs.length < inspecteurs.length && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addInspecteur}
            className="mt-1"
          >
            Ajouter un inspecteur
          </Button>
        )}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes supplémentaires
        </label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Notes ou instructions spécifiques pour cette inspection..."
          className="resize-none"
          rows={3}
        />
      </div>

      <div className="pt-2">
        <Button type="submit" className="w-full">
          Programmer l'inspection
        </Button>
      </div>
    </form>
  );
};

export default ProgrammerInspectionForm;
