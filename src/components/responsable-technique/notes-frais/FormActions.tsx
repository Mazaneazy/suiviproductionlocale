
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileCog } from 'lucide-react';

interface FormActionsProps {
  isSubmitting: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ isSubmitting }) => {
  return (
    <div className="flex justify-end pt-4 border-t">
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
