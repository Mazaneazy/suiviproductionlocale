
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types';
import { getRoleLabels } from '@/utils/userUtils';

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddUser: (user: { name: string; email: string; role: UserRole; avatar: string }) => Promise<void>;
  existingEmails: string[];
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ open, onOpenChange, onAddUser, existingEmails }) => {
  const { toast } = useToast();
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '' as UserRole,
    avatar: ''
  });
  
  const roleLabels = getRoleLabels();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  const handleRoleChange = (role: UserRole) => {
    setNewUser({
      ...newUser,
      role,
    });
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Tous les champs sont obligatoires",
      });
      return;
    }

    // Check for duplicate email
    const emailExists = existingEmails.includes(newUser.email);
    if (emailExists) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Un utilisateur avec cet email existe déjà",
      });
      return;
    }

    try {
      await onAddUser(newUser);
      // Reset form
      setNewUser({
        name: '',
        email: '',
        role: '' as UserRole,
        avatar: ''
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'utilisateur",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right font-medium text-sm">
              Nom complet
            </label>
            <Input
              id="name"
              name="name"
              value={newUser.name}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="email" className="text-right font-medium text-sm">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={newUser.email}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="role" className="text-right font-medium text-sm">
              Rôle
            </label>
            <Select
              value={newUser.role}
              onValueChange={(value) => handleRoleChange(value as UserRole)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(roleLabels).map(([role, label]) => (
                  <SelectItem key={role} value={role}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button onClick={handleAddUser}>Créer l'utilisateur</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
