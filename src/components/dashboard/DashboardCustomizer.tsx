
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DashboardCustomizerProps {
  isCustomizing: boolean;
  setIsCustomizing: (value: boolean) => void;
  currentLayout: string[];
  onSaveLayout: (layout: string[]) => void;
}

const DashboardCustomizer: React.FC<DashboardCustomizerProps> = ({
  isCustomizing,
  setIsCustomizing,
  currentLayout,
  onSaveLayout
}) => {
  const { toast } = useToast();
  
  const handleSave = () => {
    // Suggérer une disposition par défaut si aucun élément n'est sélectionné
    const layout = currentLayout.length > 0 ? 
      currentLayout : 
      ['stats', 'chart', 'dossiers', 'notifications'];
    
    onSaveLayout(layout);
    toast({
      title: "Tableau de bord mis à jour",
      description: "Vos préférences ont été enregistrées."
    });
  };
  
  const handleCancel = () => {
    setIsCustomizing(false);
    toast({
      title: "Personnalisation annulée",
      description: "Aucune modification n'a été enregistrée."
    });
  };
  
  if (isCustomizing) {
    return (
      <div className="flex gap-2">
        <Button variant="default" onClick={handleSave} className="flex items-center gap-1 bg-certif-blue hover:bg-certif-blue/90">
          <Save className="h-4 w-4" />
          Enregistrer
        </Button>
        <Button variant="outline" onClick={handleCancel} className="flex items-center gap-1">
          <X className="h-4 w-4" />
          Annuler
        </Button>
      </div>
    );
  }
  
  return (
    <Button 
      variant="outline" 
      onClick={() => setIsCustomizing(true)}
      className="flex items-center gap-1"
    >
      <Settings className="h-4 w-4" />
      Personnaliser
    </Button>
  );
};

export default DashboardCustomizer;
