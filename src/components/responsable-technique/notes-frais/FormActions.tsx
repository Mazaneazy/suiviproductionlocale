
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileCog } from 'lucide-react';

interface FormActionsProps {
  isSubmitting?: boolean;
  onReset?: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({ isSubmitting = false, onReset }) => {
  return (
    <div className="flex justify-end pt-4 border-t">
      {onReset && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={onReset}
          className="mr-2"
        >
          Réinitialiser
        </Button>
      )}
      <Button type="submit" disabled={isSubmitting} className="bg-certif-green hover:bg-certif-green/90">
        {isSubmitting ? (
          <>Création en cours...</>
        ) : (
          <>
            <FileCog className="mr-2" size={16} />
            Créer la note de frais
          </>
        )}
      </Button>
    </div>
  );
};

export default FormActions;
