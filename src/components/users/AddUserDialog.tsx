
import React, { useState } from 'react';
import { User, UserRole } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';
import { roleLabels } from './userUtils';

const AddUserDialog: React.FC<{ onUserAdded: () => void }> = ({ onUserAdded }) => {
  const { createUser } = useAuth();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '' as UserRole,
    password: ''
  });

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
    if (!newUser.name || !newUser.email || !newUser.role || !newUser.password) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Tous les champs sont obligatoires",
      });
      return;
    }

    try {
      const success = await createUser({...newUser});
      if (success) {
        toast({
          title: "Utilisateur créé",
          description: `L'utilisateur ${newUser.name} a été créé avec succès`,
        });
        setDialogOpen(false);
        setNewUser({
          name: '',
          email: '',
          role: '' as UserRole,
          password: ''
        });
        onUserAdded();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'utilisateur",
      });
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-certif-blue hover:bg-certif-blue/90">
          <PlusCircle className="mr-2" size={16} />
          Nouvel utilisateur
        </Button>
      </DialogTrigger>
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
            <label htmlFor="password" className="text-right font-medium text-sm">
              Mot de passe
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              value={newUser.password}
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
