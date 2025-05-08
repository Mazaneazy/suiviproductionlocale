
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, Save, Loader2 } from 'lucide-react';

interface FormFooterProps {
  onSave: (e: React.MouseEvent) => void;
  isSubmitting?: boolean;
}

const FormFooter: React.FC<FormFooterProps> = ({ onSave, isSubmitting = false }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end space-x-2 w-full">
      <Button type="button" variant="outline" onClick={() => navigate('/dossiers')}>
        Annuler
      </Button>
      <Button 
        type="button" 
        variant="secondary" 
        onClick={onSave}
        disabled={isSubmitting}
        className="bg-blue-500 hover:bg-blue-600 text-white"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enregistrement...
          </>
        ) : (
          <>
            <Save className="mr-2" size={16} />
            Enregistrer
          </>
        )}
      </Button>
      <Button 
        type="submit" 
        className="bg-certif-green hover:bg-certif-green/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Traitement...
          </>
        ) : (
          <>
            <PlusCircle className="mr-2" size={16} />
            Enregistrer et transmettre
          </>
        )}
      </Button>
    </div>
  );
};

export default FormFooter;
