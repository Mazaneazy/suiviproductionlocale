
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dossier } from '@/types';
import { toast } from '@/hooks/use-toast';

interface NewInspectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dossiers: Dossier[];
  onAddInspection: (inspection: any) => void;
}

const NewInspectionDialog: React.FC<NewInspectionDialogProps> = ({
  open,
  onOpenChange,
  dossiers,
  onAddInspection,
}) => {
  const [dossierId, setDossierId] = useState('');
  const [dateInspection, setDateInspection] = useState('');
  const [lieu, setLieu] = useState('');
  const [inspecteurs, setInspecteurs] = useState<string[]>(['']);
  const [notes, setNotes] = useState('');

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setDossierId('');
      setDateInspection('');
      setLieu('');
      setInspecteurs(['']);
      setNotes('');
      
      // Set default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDateInspection(tomorrow.toISOString().split('T')[0]);
    }
  }, [open]);

  // Handle inspecteur changes
  const handleInspecteurChange = (index: number, value: string) => {
    const newInspecteurs = [...inspecteurs];
    newInspecteurs[index] = value;
    setInspecteurs(newInspecteurs);
  };

  // Add inspecteur field
  const addInspecteur = () => {
    setInspecteurs([...inspecteurs, '']);
  };

  // Remove inspecteur field
  const removeInspecteur = (index: number) => {
    if (inspecteurs.length > 1) {
      const newInspecteurs = inspecteurs.filter((_, i) => i !== index);
      setInspecteurs(newInspecteurs);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!dossierId || !dateInspection || !lieu || inspecteurs.some(i => !i)) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }
    
    // Create new inspection
    const newInspection = {
      dossierId,
      dateInspection,
      date_inspection: dateInspection, // For compatibility with both naming conventions
      lieu,
      inspecteurs: inspecteurs.filter(i => i), // Remove any empty inspecteurs
      notes,
      resultat: 'en_attente',
      status: 'planifiee',
      date_creation: new Date().toISOString()
    };
    
    onAddInspection(newInspection);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Programmer une nouvelle inspection</DialogTitle>
          <DialogDescription>
            Remplissez les détails pour planifier une inspection pour un dossier.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="dossier">Dossier</Label>
            <Select value={dossierId} onValueChange={setDossierId}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un dossier" />
              </SelectTrigger>
              <SelectContent>
                {dossiers.map(dossier => (
                  <SelectItem key={dossier.id} value={dossier.id}>
                    {dossier.operateurNom || dossier.operateur_nom} - {dossier.reference || '(Sans référence)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateInspection">Date d'inspection</Label>
            <div className="relative">
              <Input
                id="dateInspection"
                type="date"
                value={dateInspection}
                onChange={e => setDateInspection(e.target.value)}
                className="pl-10"
              />
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lieu">Lieu</Label>
            <Input
              id="lieu"
              value={lieu}
              onChange={e => setLieu(e.target.value)}
              placeholder="Adresse du lieu d'inspection"
            />
          </div>

          <div className="space-y-2">
            <Label>Inspecteurs</Label>
            {inspecteurs.map((inspecteur, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={inspecteur}
                  onChange={e => handleInspecteurChange(index, e.target.value)}
                  placeholder={`Nom de l'inspecteur ${index + 1}`}
                  className="flex-1"
                />
                {inspecteurs.length > 1 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={() => removeInspecteur(index)}
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
            ))}
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={addInspecteur}
              className="w-full mt-2"
            >
              Ajouter un inspecteur
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Informations supplémentaires pour l'inspection"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Programmer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewInspectionDialog;
