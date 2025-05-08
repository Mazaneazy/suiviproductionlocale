
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, Save } from 'lucide-react';

interface FormFooterProps {
  onSave: (e: React.MouseEvent) => void;
}

const FormFooter: React.FC<FormFooterProps> = ({ onSave }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end space-x-2">
      <Button type="button" variant="outline" onClick={() => navigate('/dossiers')}>
        Annuler
      </Button>
      <Button 
        type="button" 
        variant="secondary" 
        onClick={onSave}
        className="bg-blue-500 hover:bg-blue-600 text-white"
      >
        <Save className="mr-2" size={16} />
        Enregistrer
      </Button>
      <Button type="submit" className="bg-certif-green hover:bg-certif-green/90">
        <PlusCircle className="mr-2" size={16} />
        Enregistrer et transmettre
      </Button>
    </div>
  );
};

export default FormFooter;
