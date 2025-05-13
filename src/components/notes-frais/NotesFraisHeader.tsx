
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface NotesFraisHeaderProps {
  title?: string;
}

const NotesFraisHeader = ({ title = "Notes de frais" }: NotesFraisHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold text-certif-blue">{title}</h1>
      <Button 
        onClick={() => navigate('/notes-frais/add')}
        className="bg-certif-blue hover:bg-certif-blue/90"
      >
        <Plus className="mr-2" size={16} />
        Ajouter une note de frais
      </Button>
    </div>
  );
};

export default NotesFraisHeader;
