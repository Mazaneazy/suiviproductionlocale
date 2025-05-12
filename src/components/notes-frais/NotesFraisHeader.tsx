
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NotesFraisHeaderProps {
  onOpenDialog?: () => void; // On garde ce prop pour la compatibilité, mais nous ne l'utiliserons plus
}

const NotesFraisHeader: React.FC<NotesFraisHeaderProps> = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center">
        <img 
          src="/lovable-uploads/e1bf7151-3abe-4c2a-8037-71e791d77bf9.png" 
          alt="ANOR Logo" 
          className="h-14 mr-4" 
        />
        <h1 className="text-3xl font-bold text-certif-blue">Notes de frais</h1>
      </div>
      <Link to="/notes-frais/nouveau">
        <Button 
          className="bg-certif-blue hover:bg-certif-blue/90"
        >
          <PlusCircle className="mr-2" size={16} />
          Nouvelle note de frais
        </Button>
      </Link>
    </div>
  );
};

export default NotesFraisHeader;
