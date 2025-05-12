
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
  const { getDossierById, updateDossier, dossiers } = useData();
  const { getAllUsers, currentUser } = useAuth();
  const { toast } = useToast();
  
  const dossier = getDossierById(dossierId);
  const allUsers = getAllUsers();
  
  // Vérifier si l'utilisateur actuel a le rôle 'acceuil'
  const isAccueilRole = currentUser?.role === 'acceuil';
  
  // Filter users with responsable_technique role
  const techniciens = allUsers.filter(user => 
    user.role === 'responsable_technique'
  );

  // Vérifier quels techniciens sont déjà assignés à d'autres dossiers en cours
  // Un pilote technique ne peut être assigné qu'à un seul dossier à la fois
  const techniciensDispo = techniciens.filter(user => {
    // Si le technicien est déjà assigné à ce dossier, il est disponible pour ce dossier
    if (dossier?.piloteTechniqueId === user.id) {
      return true;
    }
    
    // Vérifier s'il est assigné à d'autres dossiers en cours
    const autresDossiersAssignes = dossiers.filter(d => 
      d.piloteTechniqueId === user.id && 
      d.id !== dossierId && 
      !['certifie', 'rejete', 'archive'].includes(d.status)
    );
    
    // S'il n'est pas assigné à d'autres dossiers en cours, il est disponible
    return autresDossiersAssignes.length === 0;
  });

  const handleAssign = () => {
    // Bloquer l'action si l'utilisateur est un chargé de clientèle
    if (isAccueilRole) {
      toast({
        title: "Action non autorisée",
        description: "Vous n'avez pas les droits pour assigner un pilote technique",
        variant: "destructive",
      });
      return;
    }

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
    
    // Vérifier si le pilote technique est déjà assigné à un autre dossier en cours
    if (selectedUserId !== dossier?.piloteTechniqueId) {
      const autresDossiersAssignes = dossiers.filter(d => 
        d.piloteTechniqueId === selectedUserId && 
        d.id !== dossierId && 
        !['certifie', 'rejete', 'archive'].includes(d.status)
      );
      
      if (autresDossiersAssignes.length > 0) {
        toast({
          title: "Pilote technique déjà assigné",
          description: `${selectedUser.name} est déjà assigné à un autre dossier en cours. Un pilote technique ne peut être assigné qu'à un seul dossier à la fois.`,
          variant: "destructive",
        });
        return;
      }
    }

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

  // Si l'utilisateur est un chargé de clientèle, ne pas afficher le bouton
  if (isAccueilRole) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Assigner pilote technique</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assigner un pilote technique</DialogTitle>
          <DialogDescription>
            Sélectionnez un responsable technique pour piloter ce dossier.
            Un pilote technique ne peut être assigné qu'à un seul dossier en cours à la fois.
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
                {techniciensDispo.length > 0 ? (
                  techniciensDispo.map((user) => (
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
            {techniciensDispo.length === 0 && techniciens.length > 0 && (
              <p className="text-sm text-amber-600 mt-1">
                Tous les responsables techniques sont actuellement assignés à d'autres dossiers en cours.
              </p>
            )}
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
