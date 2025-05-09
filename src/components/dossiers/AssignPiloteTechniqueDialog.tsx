
import React, { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { User } from '@/types';

interface AssignPiloteTechniqueDialogProps {
  dossierId: string;
  onAssigned?: () => void;
}

const AssignPiloteTechniqueDialog: React.FC<AssignPiloteTechniqueDialogProps> = ({
  dossierId,
  onAssigned
}) => {
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const { getDossierById, updateDossier } = useData();
  const { getAllUsers } = useAuth();
  const { toast } = useToast();
  
  const dossier = getDossierById(dossierId);
  const allUsers = getAllUsers();
  
  // Filter users with responsable_technique role
  const techniciens = allUsers.filter(user => 
    user.role === 'responsable_technique'
  );

  const handleAssign = () => {
    if (!selectedUserId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un pilote technique",
        variant: "destructive",
      });
      return;
    }

    const selectedUser = techniciens.find(user => user.id === selectedUserId);
    if (!selectedUser) return;

    updateDossier(dossierId, {
      piloteTechniqueId: selectedUserId,
      piloteTechniqueNom: selectedUser.name,
      responsable: selectedUser.name,
      historique: [
        ...(dossier?.historique || []),
        {
          id: Date.now().toString(),
          dossierId: dossierId,
          date: new Date().toISOString(),
          action: "Assignation du pilote technique",
          responsable: "Système",
          commentaire: `${selectedUser.name} a été assigné comme pilote technique`
        }
      ]
    });

    toast({
      title: "Pilote technique assigné",
      description: `${selectedUser.name} a été assigné comme pilote technique pour ce dossier`,
    });

    setOpen(false);
    if (onAssigned) onAssigned();
  };
  
  // Reset selection when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedUserId(dossier?.piloteTechniqueId || '');
    }
  }, [open, dossier]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Assigner pilote technique</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assigner un pilote technique</DialogTitle>
          <DialogDescription>
            Sélectionnez un responsable technique pour piloter ce dossier
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="pilote">Pilote technique</Label>
            <Select
              value={selectedUserId}
              onValueChange={setSelectedUserId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un pilote technique" />
              </SelectTrigger>
              <SelectContent>
                {techniciens.length > 0 ? (
                  techniciens.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    Aucun responsable technique disponible
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleAssign}>
            Assigner
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignPiloteTechniqueDialog;
