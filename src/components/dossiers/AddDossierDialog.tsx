
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddDossierButton: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Button onClick={() => navigate('/ajouter-dossier')}>
      <Plus className="mr-2" size={16} />
      Ajouter un dossier
    </Button>
  );
};

export default AddDossierButton;
