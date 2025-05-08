
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Dossier, Inspection } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface ProgrammerInspectionDialogProps {
  dossier: Dossier;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProgrammer: (inspection: Omit<Inspection, 'id'>) => void;
}

const ProgrammerInspectionDialog: React.FC<ProgrammerInspectionDialogProps> = ({
  dossier,
  open,
  onOpenChange,
  onProgrammer,
}) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [lieu, setLieu] = useState('');
  const [inspecteurs, setInspecteurs] = useState('');

  const handleSubmit = () => {
    if (!date) {
      toast({
        title: "Date requise",
        description: "Veuillez sélectionner une date d'inspection",
        variant: "destructive",
      });
      return;
    }

    if (!lieu) {
      toast({
        title: "Lieu requis",
        description: "Veuillez saisir le lieu de l'inspection",
        variant: "destructive",
      });
      return;
    }

    if (!inspecteurs) {
      toast({
        title: "Inspecteurs requis",
        description: "Veuillez saisir les noms des inspecteurs",
        variant: "destructive",
      });
      return;
    }

    const inspection: Omit<Inspection, 'id'> = {
      dossierId: dossier.id,
      dateInspection: date.toISOString(),
      lieu,
      inspecteurs: inspecteurs.split(',').map(i => i.trim()),
      resultat: 'en_attente',
    };

    onProgrammer(inspection);
    onOpenChange(false);

    // Réinitialiser le formulaire
    setDate(new Date());
    setLieu('');
    setInspecteurs('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Programmer une inspection</DialogTitle>
          <DialogDescription>
            Définissez la date, le lieu et les inspecteurs assignés pour cette inspection.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date d'inspection</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: fr }) : <span>Sélectionner une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lieu">Lieu de l'inspection</Label>
            <Input
              id="lieu"
              value={lieu}
              onChange={(e) => setLieu(e.target.value)}
              placeholder="Adresse ou site de l'inspection"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inspecteurs">Inspecteurs assignés</Label>
            <Input
              id="inspecteurs"
              value={inspecteurs}
              onChange={(e) => setInspecteurs(e.target.value)}
              placeholder="Noms séparés par des virgules"
            />
            <p className="text-xs text-gray-500">
              Entrez les noms des inspecteurs séparés par des virgules.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Programmer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProgrammerInspectionDialog;
