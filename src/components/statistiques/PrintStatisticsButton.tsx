
import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

const PrintStatisticsButton: React.FC = () => {
  const { toast } = useToast();
  const { statistiques, dossiers, certificats, inspections } = useData();
  const [selectedStats, setSelectedStats] = useState({
    general: true,
    dossiers: true,
    financier: true,
    certificats: true,
    inspections: true
  });
  
  const handleChange = (key: keyof typeof selectedStats) => {
    setSelectedStats({
      ...selectedStats,
      [key]: !selectedStats[key]
    });
  };
  
  const handlePrint = () => {
    toast({
      title: "Impression des statistiques",
      description: "Les statistiques sélectionnées sont en cours d'impression.",
    });
    
    // Simuler un délai avant la génération du PDF
    setTimeout(() => {
      toast({
        title: "Statistiques générées",
        description: "Le fichier PDF a été généré avec succès.",
      });
    }, 1500);
    
    // En production, ici nous lancerions la génération réelle du PDF
    console.log("Statistiques à imprimer:", selectedStats);
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-certif-blue hover:bg-certif-blue/90">
          <Printer className="mr-2" size={16} />
          Imprimer les statistiques
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sélectionner les statistiques à imprimer</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="general" 
              checked={selectedStats.general} 
              onCheckedChange={() => handleChange('general')}
            />
            <Label htmlFor="general">Statistiques générales</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="dossiers" 
              checked={selectedStats.dossiers} 
              onCheckedChange={() => handleChange('dossiers')}
            />
            <Label htmlFor="dossiers">Statistiques des dossiers</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="financier" 
              checked={selectedStats.financier} 
              onCheckedChange={() => handleChange('financier')}
            />
            <Label htmlFor="financier">Statistiques financières (FCFA)</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="certificats" 
              checked={selectedStats.certificats} 
              onCheckedChange={() => handleChange('certificats')}
            />
            <Label htmlFor="certificats">Statistiques des certificats</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="inspections" 
              checked={selectedStats.inspections} 
              onCheckedChange={() => handleChange('inspections')}
            />
            <Label htmlFor="inspections">Statistiques des inspections</Label>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button onClick={handlePrint} className="bg-certif-blue hover:bg-certif-blue/90">
            <Printer className="mr-2" size={16} />
            Imprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PrintStatisticsButton;
