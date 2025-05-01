
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
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
import { ClipboardCheck, PlusCircle, MapPin, Calendar, User } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import InspectionDetails from '../components/inspections/InspectionDetails';

const Inspections = () => {
  const { inspections, dossiers, addInspection, updateInspection } = useData();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('tous');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inspectionDetailsOpen, setInspectionDetailsOpen] = useState(false);
  const [selectedInspectionId, setSelectedInspectionId] = useState('');
  
  // État pour la nouvelle inspection
  const [newInspection, setNewInspection] = useState({
    dossierId: '',
    dateInspection: new Date().toISOString().split('T')[0],
    lieu: '',
    inspecteurs: [currentUser?.name || ''],
    resultat: 'en_attente' as 'conforme' | 'non_conforme' | 'en_attente',
    recommandations: '',
    actionsCorrectives: ''
  });

  // Filtrer les inspections en fonction des critères de recherche
  const filteredInspections = inspections.filter(inspection => {
    const dossier = dossiers.find(d => d.id === inspection.dossierId);
    
    const matchesSearch = dossier 
      ? dossier.operateurNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inspection.lieu.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    
    const matchesStatus = statusFilter === 'tous' || inspection.resultat === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Fonction pour mettre à jour les champs de la nouvelle inspection
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewInspection({
      ...newInspection,
      [name]: value,
    });
  };

  // Fonction pour ajouter une nouvelle inspection
  const handleAddInspection = () => {
    // Vérifier que tous les champs obligatoires sont remplis
    if (!newInspection.dossierId || !newInspection.lieu) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
      });
      return;
    }

    addInspection(newInspection);
    toast({
      title: "Inspection programmée",
      description: "L'inspection a été programmée avec succès.",
    });
    
    // Réinitialiser le formulaire
    setNewInspection({
      dossierId: '',
      dateInspection: new Date().toISOString().split('T')[0],
      lieu: '',
      inspecteurs: [currentUser?.name || ''],
      resultat: 'en_attente',
      recommandations: '',
      actionsCorrectives: ''
    });
    
    setDialogOpen(false);
  };

  // Fonction pour marquer une inspection comme conforme
  const handleMarkAsConforme = (id: string) => {
    updateInspection(id, { 
      resultat: 'conforme',
      recommandations: 'Inspection validée. Dossier conforme.'
    });
    toast({
      title: "Inspection validée",
      description: "L'inspection a été marquée comme conforme.",
    });
  };

  // Fonction pour marquer une inspection comme non-conforme
  const handleMarkAsNonConforme = (id: string) => {
    updateInspection(id, { 
      resultat: 'non_conforme',
      actionsCorrectives: 'Des actions correctives sont nécessaires.'
    });
    toast({
      title: "Inspection non-conforme",
      description: "L'inspection a été marquée comme non-conforme.",
    });
  };

  // Fonction pour afficher les détails d'une inspection
  const handleViewDetails = (id: string) => {
    setSelectedInspectionId(id);
    setInspectionDetailsOpen(true);
  };

  // Fonction pour obtenir la couleur du badge en fonction du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'conforme':
        return 'bg-green-500 text-white';
      case 'non_conforme':
        return 'bg-red-500 text-white';
      case 'en_attente':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Fonction pour formater le statut pour l'affichage
  const formatStatus = (status: string) => {
    switch (status) {
      case 'conforme':
        return 'Conforme';
      case 'non_conforme':
        return 'Non conforme';
      case 'en_attente':
        return 'En attente';
      default:
        return status;
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-certif-blue">Inspections</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-certif-blue hover:bg-certif-blue/90">
              <PlusCircle className="mr-2" size={16} />
              Nouvelle inspection
            </Button>
          </DialogTrigger>
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
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Input
              placeholder="Rechercher par opérateur ou lieu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <ClipboardCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les statuts</SelectItem>
              <SelectItem value="en_attente">En attente</SelectItem>
              <SelectItem value="conforme">Conforme</SelectItem>
              <SelectItem value="non_conforme">Non conforme</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Date d'inspection</TableHead>
                <TableHead>Opérateur</TableHead>
                <TableHead>Lieu</TableHead>
                <TableHead>Inspecteurs</TableHead>
                <TableHead>Résultat</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInspections.length > 0 ? (
                filteredInspections.map((inspection) => {
                  const dossier = dossiers.find(d => d.id === inspection.dossierId);
                  const isPast = new Date(inspection.dateInspection) < new Date();
                  const canUpdate = isPast && inspection.resultat === 'en_attente' && currentUser?.role === 'inspecteur';
                  
                  return (
                    <TableRow key={inspection.id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="mr-2 text-gray-500" size={16} />
                          {new Date(inspection.dateInspection).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{dossier?.operateurNom}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="mr-1 text-gray-500" size={16} />
                          {inspection.lieu}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="mr-1 text-gray-500" size={16} />
                          {inspection.inspecteurs.join(', ')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(inspection.resultat)}>
                          {formatStatus(inspection.resultat)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {canUpdate && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-green-600 border-green-600 hover:bg-green-50"
                                onClick={() => handleMarkAsConforme(inspection.id)}
                              >
                                Conforme
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-600 border-red-600 hover:bg-red-50"
                                onClick={() => handleMarkAsNonConforme(inspection.id)}
                              >
                                Non conforme
                              </Button>
                            </>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(inspection.id)}
                          >
                            Détails
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Aucune inspection trouvée
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Le dialogue de détails d'inspection */}
      {inspectionDetailsOpen && selectedInspectionId && (
        <InspectionDetails 
          isOpen={inspectionDetailsOpen}
          onClose={() => setInspectionDetailsOpen(false)}
          inspectionId={selectedInspectionId}
        />
      )}
    </Layout>
  );
};

export default Inspections;
