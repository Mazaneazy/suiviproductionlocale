
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import { UserRound, PlusCircle } from 'lucide-react';
import { User, UserRole } from '../types';

const UserManagement = () => {
  const { getAllUsers, createUser } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(getAllUsers());
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '' as UserRole,
    avatar: ''
  });

  const roleLabels: Record<string, string> = {
    'admin': 'Administrateur',
    'acceuil': 'Poste d\'Accueil',
    'inspecteur': 'Chef des Inspections',
    'analyste': 'Chargé du reporting',
    'surveillant': 'Agent de surveillance',
    'comptable': 'Responsable Notes de Frais',
    'directeur': 'Directeur Evaluation Conformité',
    'responsable_technique': 'Responsable Technique',
    'chef_mission': 'Chef de Mission d\'Inspection',
    'certificats': 'Délivrance des Certificats',
    'directeur_general': 'Directeur Général ANOR',
    'gestionnaire': 'Gestionnaire des Dossiers'
  };

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
    const emailExists = users.some(user => user.email === newUser.email);
    if (emailExists) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Un utilisateur avec cet email existe déjà",
      });
      return;
    }

    try {
      const success = await createUser(newUser);
      if (success) {
        toast({
          title: "Utilisateur créé",
          description: `L'utilisateur ${newUser.name} a été créé avec succès`,
        });
        setUsers(getAllUsers());
        setDialogOpen(false);
        setNewUser({
          name: '',
          email: '',
          role: '' as UserRole,
          avatar: ''
        });
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
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-certif-blue">Gestion des utilisateurs</h1>
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
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <div className="bg-gray-100 p-1 rounded-full">
                        <UserRound size={20} className="text-gray-500" />
                      </div>
                      <span>{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {roleLabels[user.role] || user.role}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
};

export default UserManagement;
