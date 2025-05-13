
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NewInspectionButtonProps {
  dossierId?: string;
  className?: string;
}

const NewInspectionButton: React.FC<NewInspectionButtonProps> = ({ dossierId, className }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    const url = dossierId 
      ? `/ajouter-inspection/${dossierId}` 
      : '/ajouter-inspection';
    navigate(url);
  };
  
  return (
    <Button 
      onClick={handleClick}
      className={className || "bg-certif-blue hover:bg-certif-blue/90"}
    >
      <PlusCircle className="mr-2" size={16} />
      Nouvelle mission
    </Button>
  );
};

export default NewInspectionButton;
