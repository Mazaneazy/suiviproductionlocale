
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
import { FileText, AlertCircle, CheckCircle, Clock, PlusCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Dossiers = () => {
  const { dossiers, addDossier } = useData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('tous');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // État pour le nouveau dossier
  const [newDossier, setNewDossier] = useState({
    operateurNom: '',
    typeProduit: '',
    responsable: 'Gestionnaire',
    dateTransmission: new Date().toISOString().split('T')[0],
    status: 'en_attente',
    delai: 30,
    dateButoir: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  // Filtrer les dossiers en fonction des critères de recherche
  const filteredDossiers = dossiers.filter(dossier => {
    const matchesSearch = 
      dossier.operateurNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.typeProduit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.responsable.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'tous' || dossier.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Fonction pour mettre à jour les champs du nouveau dossier
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Si le délai est modifié, recalculer la date butoir
    if (name === 'delai') {
      const delaiValue = parseInt(value) || 0;
      const dateTransmission = new Date(newDossier.dateTransmission);
      const dateButoir = new Date(dateTransmission);
      dateButoir.setDate(dateTransmission.getDate() + delaiValue);
      
      setNewDossier({
        ...newDossier,
        [name]: delaiValue,
        dateButoir: dateButoir.toISOString().split('T')[0],
      });
    }
    // Si la date de transmission est modifiée, recalculer la date butoir
    else if (name === 'dateTransmission') {
      const dateTransmission = new Date(value);
      const dateButoir = new Date(dateTransmission);
      dateButoir.setDate(dateTransmission.getDate() + newDossier.delai);
      
      setNewDossier({
        ...newDossier,
        [name]: value,
        dateButoir: dateButoir.toISOString().split('T')[0],
      });
    }
    else {
      setNewDossier({
        ...newDossier,
        [name]: value,
      });
    }
  };

  // Fonction pour ajouter un nouveau dossier
  const handleAddDossier = () => {
    // Vérifier que tous les champs obligatoires sont remplis
    if (!newDossier.operateurNom || !newDossier.typeProduit) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
      });
      return;
    }

    addDossier(newDossier);
    toast({
      title: "Dossier ajouté",
      description: `Le dossier pour "${newDossier.operateurNom}" a été créé avec succès.`,
    });
    
    // Réinitialiser le formulaire
    setNewDossier({
      operateurNom: '',
      typeProduit: '',
      responsable: 'Gestionnaire',
      dateTransmission: new Date().toISOString().split('T')[0],
      status: 'en_attente',
      delai: 30,
      dateButoir: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    
    setDialogOpen(false);
  };

  // Fonction pour obtenir la couleur du badge en fonction du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complet':
        return 'bg-blue-500 text-white';
      case 'en_cours':
        return 'bg-yellow-500 text-white';
      case 'en_attente':
        return 'bg-gray-500 text-white';
      case 'rejete':
        return 'bg-red-500 text-white';
      case 'certifie':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Fonction pour formater le statut pour l'affichage
  const formatStatus = (status: string) => {
    switch (status) {
      case 'complet':
        return 'Complet';
      case 'en_cours':
        return 'En cours';
      case 'en_attente':
        return 'En attente';
      case 'rejete':
        return 'Rejeté';
      case 'certifie':
        return 'Certifié';
      default:
        return status;
    }
  };

  // Vérifier si un dossier est en retard
  const isLate = (dateButoir: string) => {
    const now = new Date();
    const butoir = new Date(dateButoir);
    return butoir < now;
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-certif-blue">Transmission dossiers</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-certif-green hover:bg-certif-green/90">
              <PlusCircle className="mr-2" size={16} />
              Nouveau dossier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau dossier</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="operateurNom" className="text-right font-medium text-sm">
                  Opérateur*
                </label>
                <Input
                  id="operateurNom"
                  name="operateurNom"
                  value={newDossier.operateurNom}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="Nom de l'opérateur"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="typeProduit" className="text-right font-medium text-sm">
                  Type de produit*
                </label>
                <Input
                  id="typeProduit"
                  name="typeProduit"
                  value={newDossier.typeProduit}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="Type de produit"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="dateTransmission" className="text-right font-medium text-sm">
                  Date de transmission
                </label>
                <Input
                  id="dateTransmission"
                  name="dateTransmission"
                  type="date"
                  value={newDossier.dateTransmission}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="delai" className="text-right font-medium text-sm">
                  Délai (jours)
                </label>
                <Input
                  id="delai"
                  name="delai"
                  type="number"
                  value={newDossier.delai}
                  onChange={handleInputChange}
                  className="col-span-3"
                  min={1}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="dateButoir" className="text-right font-medium text-sm">
                  Date butoir
                </label>
                <Input
                  id="dateButoir"
                  name="dateButoir"
                  type="date"
                  value={newDossier.dateButoir}
                  readOnly
                  className="col-span-3 bg-gray-50"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="status" className="text-right font-medium text-sm">
                  Statut
                </label>
                <Select
                  value={newDossier.status}
                  onValueChange={(value) => setNewDossier({ ...newDossier, status: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en_attente">En attente</SelectItem>
                    <SelectItem value="complet">Complet</SelectItem>
                    <SelectItem value="en_cours">En cours</SelectItem>
                    <SelectItem value="rejete">Rejeté</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button onClick={handleAddDossier} className="bg-certif-green hover:bg-certif-green/90">
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
              placeholder="Rechercher un dossier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les statuts</SelectItem>
              <SelectItem value="en_attente">En attente</SelectItem>
              <SelectItem value="complet">Complet</SelectItem>
              <SelectItem value="en_cours">En cours</SelectItem>
              <SelectItem value="rejete">Rejeté</SelectItem>
              <SelectItem value="certifie">Certifié</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Opérateur</TableHead>
                <TableHead>Type de produit</TableHead>
                <TableHead>Date transmission</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date butoir</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDossiers.length > 0 ? (
                filteredDossiers.map((dossier) => (
                  <TableRow key={dossier.id}>
                    <TableCell className="font-medium">{dossier.operateurNom}</TableCell>
                    <TableCell>{dossier.typeProduit}</TableCell>
                    <TableCell>{new Date(dossier.dateTransmission).toLocaleDateString()}</TableCell>
                    <TableCell>{dossier.responsable}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(dossier.status)}>
                        {formatStatus(dossier.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center">
                        {isLate(dossier.dateButoir) && dossier.status !== 'certifie' && dossier.status !== 'rejete' && (
                          <AlertCircle className="mr-1 text-certif-red" size={16} />
                        )}
                        <span className={isLate(dossier.dateButoir) && dossier.status !== 'certifie' && dossier.status !== 'rejete' ? 'text-certif-red' : ''}>
                          {new Date(dossier.dateButoir).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Voir détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Aucun dossier trouvé
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

export default Dossiers;
