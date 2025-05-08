
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { User, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface NewInspectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dossiers: any[];
  onAddInspection: (inspection: any) => void;
}

const NewInspectionDialog: React.FC<NewInspectionDialogProps> = ({
  open,
  onOpenChange,
  dossiers,
  onAddInspection,
}) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  // État pour le nouvel inspecteur à ajouter
  const [newInspectorName, setNewInspectorName] = useState('');
  
  // État pour la nouvelle inspection
  const [newInspection, setNewInspection] = useState({
    dossierId: '',
    dateInspection: new Date().toISOString().split('T')[0],
    lieu: '',
    inspecteurs: currentUser?.name ? [currentUser.name] : [],
    resultat: 'en_attente' as 'conforme' | 'non_conforme' | 'en_attente',
    recommandations: '',
    actionsCorrectives: ''
  });

  // Fonction pour mettre à jour les champs de la nouvelle inspection
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewInspection({
      ...newInspection,
      [name]: value,
    });
  };

  // Fonction pour ajouter un inspecteur
  const handleAddInspector = () => {
    if (newInspectorName.trim() === '') return;
    
    if (!newInspection.inspecteurs.includes(newInspectorName.trim())) {
      setNewInspection({
        ...newInspection,
        inspecteurs: [...newInspection.inspecteurs, newInspectorName.trim()]
      });
    }
    
    setNewInspectorName('');
  };

  // Fonction pour supprimer un inspecteur
  const handleRemoveInspector = (inspector: string) => {
    setNewInspection({
      ...newInspection,
      inspecteurs: newInspection.inspecteurs.filter(i => i !== inspector)
    });
  };

  // Fonction pour ajouter une nouvelle inspection
  const handleAddInspection = () => {
    // Vérifier que tous les champs obligatoires sont remplis
    if (!newInspection.dossierId || !newInspection.lieu || newInspection.inspecteurs.length === 0) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires, y compris l'ajout d'au moins un inspecteur.",
      });
      return;
    }

    onAddInspection(newInspection);
    
    // Réinitialiser le formulaire
    setNewInspection({
      dossierId: '',
      dateInspection: new Date().toISOString().split('T')[0],
      lieu: '',
      inspecteurs: currentUser?.name ? [currentUser.name] : [],
      resultat: 'en_attente',
      recommandations: '',
      actionsCorrectives: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Programmer une inspection</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="dossierId" className="text-right font-medium text-sm">
              Dossier*
            </label>
            <Select
              value={newInspection.dossierId}
              onValueChange={(value) => setNewInspection({ ...newInspection, dossierId: value })}
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
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="dateInspection" className="text-right font-medium text-sm">
              Date d'inspection*
            </label>
            <Input
              id="dateInspection"
              name="dateInspection"
              type="date"
              value={newInspection.dateInspection}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="lieu" className="text-right font-medium text-sm">
              Lieu*
            </label>
            <Input
              id="lieu"
              name="lieu"
              value={newInspection.lieu}
              onChange={handleInputChange}
              className="col-span-3"
              placeholder="Adresse de l'inspection"
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <label className="text-right font-medium text-sm pt-2">
              Inspecteurs*
            </label>
            <div className="col-span-3">
              <div className="flex flex-wrap gap-2 mb-2">
                {newInspection.inspecteurs.map((inspector) => (
                  <Badge key={inspector} variant="secondary" className="flex items-center gap-1 px-2 py-1">
                    <User size={14} />
                    {inspector}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveInspector(inspector)}
                      className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newInspectorName}
                  onChange={(e) => setNewInspectorName(e.target.value)}
                  placeholder="Nom de l'inspecteur"
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddInspector}
                >
                  Ajouter
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <label htmlFor="recommandations" className="text-right font-medium text-sm pt-2">
              Notes
            </label>
            <Textarea
              id="recommandations"
              name="recommandations"
              value={newInspection.recommandations}
              onChange={handleInputChange}
              className="col-span-3"
              placeholder="Notes ou recommandations pour cette inspection"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button onClick={handleAddInspection} className="bg-certif-blue hover:bg-certif-blue/90">
            Programmer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewInspectionDialog;
