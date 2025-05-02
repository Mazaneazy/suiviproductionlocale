
import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ProgrammerInspectionForm from './ProgrammerInspectionForm';

const NewInspectionDialog: React.FC = () => {
  const { dossiers } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDossierId, setSelectedDossierId] = useState('');

  const handleProgrammerDialogOpen = () => {
    // Set default dossierId if there are eligible dossiers
    const eligibleDossiers = dossiers.filter(d => d.status !== 'certifie' && d.status !== 'rejete');
    if (eligibleDossiers.length > 0) {
      setSelectedDossierId(eligibleDossiers[0].id);
    }
    setDialogOpen(true);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-certif-blue hover:bg-certif-blue/90" onClick={handleProgrammerDialogOpen}>
          <PlusCircle className="mr-2" size={16} />
          Nouvelle inspection
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Programmer une inspection</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="grid grid-cols-4 items-center gap-4 mb-4">
            <label htmlFor="dossierId" className="text-right font-medium text-sm">
              Dossier*
            </label>
            <Select
              value={selectedDossierId}
              onValueChange={setSelectedDossierId}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Sélectionner un dossier" />
              </SelectTrigger>
              <SelectContent>
                {dossiers
                  .filter(d => d.status !== 'certifie' && d.status !== 'rejete')
                  .map((dossier) => (
                    <SelectItem key={dossier.id} value={dossier.id}>
                      {dossier.operateurNom} - {dossier.typeProduit}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
          
          {selectedDossierId && (
            <ProgrammerInspectionForm 
              dossierId={selectedDossierId} 
              onSuccess={() => setDialogOpen(false)} 
            />
          )}
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewInspectionDialog;
