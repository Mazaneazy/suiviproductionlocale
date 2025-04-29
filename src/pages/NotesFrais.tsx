
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
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
import { Badge } from '../components/ui/badge';
import { CreditCard, PlusCircle, Check, X } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';

const NotesFrais = () => {
  const { notesFrais, dossiers, addNoteFrais, updateNoteFrais } = useData();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('tous');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // État pour la nouvelle note de frais
  const [newNoteFrais, setNewNoteFrais] = useState({
    dossierId: '',
    inspecteurId: currentUser?.id || '',
    dateCreation: new Date().toISOString().split('T')[0],
    deplacement: 0,
    hebergement: 0,
    restauration: 0,
    indemnites: 0,
    status: 'en_attente',
    commentaire: ''
  });

  // Filtrer les notes de frais en fonction des critères de recherche
  const filteredNotesFrais = notesFrais.filter(note => {
    const dossier = dossiers.find(d => d.id === note.dossierId);
    
    const matchesSearch = dossier 
      ? dossier.operateurNom.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    
    const matchesStatus = statusFilter === 'tous' || note.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Fonction pour mettre à jour les champs de la nouvelle note de frais
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'deplacement' || name === 'hebergement' || name === 'restauration' || name === 'indemnites') {
      setNewNoteFrais({
        ...newNoteFrais,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setNewNoteFrais({
        ...newNoteFrais,
        [name]: value,
      });
    }
  };

  // Fonction pour ajouter une nouvelle note de frais
  const handleAddNoteFrais = () => {
    // Vérifier que tous les champs obligatoires sont remplis
    if (!newNoteFrais.dossierId) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner un dossier.",
      });
      return;
    }

    addNoteFrais(newNoteFrais);
    toast({
      title: "Note de frais ajoutée",
      description: "La note de frais a été créée avec succès.",
    });
    
    // Réinitialiser le formulaire
    setNewNoteFrais({
      dossierId: '',
      inspecteurId: currentUser?.id || '',
      dateCreation: new Date().toISOString().split('T')[0],
      deplacement: 0,
      hebergement: 0,
      restauration: 0,
      indemnites: 0,
      status: 'en_attente',
      commentaire: ''
    });
    
    setDialogOpen(false);
  };

  // Fonction pour valider une note de frais
  const handleValidateNoteFrais = (id: string) => {
    updateNoteFrais(id, { status: 'validee' });
    toast({
      title: "Note de frais validée",
      description: "La note de frais a été validée avec succès.",
    });
  };

  // Fonction pour rejeter une note de frais
  const handleRejectNoteFrais = (id: string) => {
    updateNoteFrais(id, { status: 'rejetee' });
    toast({
      title: "Note de frais rejetée",
      description: "La note de frais a été rejetée.",
    });
  };

  // Fonction pour obtenir la couleur du badge en fonction du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_attente':
        return 'bg-yellow-500 text-white';
      case 'validee':
        return 'bg-green-500 text-white';
      case 'rejetee':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Fonction pour formater le statut pour l'affichage
  const formatStatus = (status: string) => {
    switch (status) {
      case 'en_attente':
        return 'En attente';
      case 'validee':
        return 'Validée';
      case 'rejetee':
        return 'Rejetée';
      default:
        return status;
    }
  };

  // Calculer le total d'une note de frais
  const calculerTotal = (note: any) => {
    return note.deplacement + note.hebergement + note.restauration + note.indemnites;
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-certif-blue">Notes de frais</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-certif-blue hover:bg-certif-blue/90">
              <PlusCircle className="mr-2" size={16} />
              Nouvelle note de frais
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle note de frais</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="dossierId" className="text-right font-medium text-sm">
                  Dossier*
                </label>
                <Select
                  value={newNoteFrais.dossierId}
                  onValueChange={(value) => setNewNoteFrais({ ...newNoteFrais, dossierId: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner un dossier" />
                  </SelectTrigger>
                  <SelectContent>
                    {dossiers.map((dossier) => (
                      <SelectItem key={dossier.id} value={dossier.id}>
                        {dossier.operateurNom} - {dossier.typeProduit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="dateCreation" className="text-right font-medium text-sm">
                  Date
                </label>
                <Input
                  id="dateCreation"
                  name="dateCreation"
                  type="date"
                  value={newNoteFrais.dateCreation}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="deplacement" className="text-right font-medium text-sm">
                  Déplacement (€)
                </label>
                <Input
                  id="deplacement"
                  name="deplacement"
                  type="number"
                  value={newNoteFrais.deplacement}
                  onChange={handleInputChange}
                  className="col-span-3"
                  min={0}
                  step="0.01"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="hebergement" className="text-right font-medium text-sm">
                  Hébergement (€)
                </label>
                <Input
                  id="hebergement"
                  name="hebergement"
                  type="number"
                  value={newNoteFrais.hebergement}
                  onChange={handleInputChange}
                  className="col-span-3"
                  min={0}
                  step="0.01"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="restauration" className="text-right font-medium text-sm">
                  Restauration (€)
                </label>
                <Input
                  id="restauration"
                  name="restauration"
                  type="number"
                  value={newNoteFrais.restauration}
                  onChange={handleInputChange}
                  className="col-span-3"
                  min={0}
                  step="0.01"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="indemnites" className="text-right font-medium text-sm">
                  Indemnités (€)
                </label>
                <Input
                  id="indemnites"
                  name="indemnites"
                  type="number"
                  value={newNoteFrais.indemnites}
                  onChange={handleInputChange}
                  className="col-span-3"
                  min={0}
                  step="0.01"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="commentaire" className="text-right font-medium text-sm">
                  Commentaire
                </label>
                <Input
                  id="commentaire"
                  name="commentaire"
                  value={newNoteFrais.commentaire}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button onClick={handleAddNoteFrais} className="bg-certif-blue hover:bg-certif-blue/90">
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Input
              placeholder="Rechercher par nom d'opérateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les statuts</SelectItem>
              <SelectItem value="en_attente">En attente</SelectItem>
              <SelectItem value="validee">Validée</SelectItem>
              <SelectItem value="rejetee">Rejetée</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Opérateur</TableHead>
                <TableHead className="text-right">Déplacement</TableHead>
                <TableHead className="text-right">Hébergement</TableHead>
                <TableHead className="text-right">Restauration</TableHead>
                <TableHead className="text-right">Indemnités</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotesFrais.length > 0 ? (
                filteredNotesFrais.map((note) => {
                  const dossier = dossiers.find(d => d.id === note.dossierId);
                  const total = calculerTotal(note);
                  
                  return (
                    <TableRow key={note.id}>
                      <TableCell>{new Date(note.dateCreation).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{dossier?.operateurNom}</TableCell>
                      <TableCell className="text-right">{note.deplacement.toFixed(2)} €</TableCell>
                      <TableCell className="text-right">{note.hebergement.toFixed(2)} €</TableCell>
                      <TableCell className="text-right">{note.restauration.toFixed(2)} €</TableCell>
                      <TableCell className="text-right">{note.indemnites.toFixed(2)} €</TableCell>
                      <TableCell className="text-right font-medium">{total.toFixed(2)} €</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(note.status)}>
                          {formatStatus(note.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {note.status === 'en_attente' && currentUser?.role === 'comptable' && (
                            <>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8 text-green-500 hover:text-green-700"
                                onClick={() => handleValidateNoteFrais(note.id)}
                              >
                                <Check size={16} />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8 text-red-500 hover:text-red-700"
                                onClick={() => handleRejectNoteFrais(note.id)}
                              >
                                <X size={16} />
                              </Button>
                            </>
                          )}
                          <Button variant="outline" size="sm">
                            Détails
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    Aucune note de frais trouvée
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
};

export default NotesFrais;
