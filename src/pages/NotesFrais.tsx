
import React, { useState, useRef } from 'react';
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
import { CreditCard, PlusCircle, Check, X, Upload, Mail, FileText } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { NoteFrais } from '../types';

const NotesFrais = () => {
  const { notesFrais, dossiers, addNoteFrais, updateNoteFrais } = useData();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('tous');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<NoteFrais | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // État pour la nouvelle note de frais
  const [newNoteFrais, setNewNoteFrais] = useState({
    dossierId: '',
    inspecteurId: currentUser?.id || '',
    date: new Date().toISOString().split('T')[0],
    deplacement: 0,
    hebergement: 0,
    restauration: 0,
    indemnites: 0,
    status: 'en_attente' as 'en_attente' | 'valide' | 'rejete',
    commentaire: '',
    description: '',
    montant: 0,
    fichierUrl: '',
    notificationEnvoyee: false,
    operateurNotifie: false
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

  // Fonction pour gérer l'upload de fichier
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      toast({
        title: "Fichier sélectionné",
        description: `${file.name} a été sélectionné.`,
      });
    }
  };

  // Fonction pour simuler l'envoi d'une notification par email
  const handleSendNotification = (noteId: string) => {
    updateNoteFrais(noteId, { 
      notificationEnvoyee: true 
    });
    
    toast({
      title: "Notification envoyée",
      description: "L'opérateur a été notifié de sa note de frais.",
    });
  };

  // Fonction pour marquer comme notifié
  const handleMarkAsNotified = (noteId: string) => {
    updateNoteFrais(noteId, { 
      operateurNotifie: true 
    });
    
    toast({
      title: "Confirmation reçue",
      description: "L'opérateur a confirmé la réception de sa note de frais.",
    });
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

    // Calculer le montant total
    const total = 
      newNoteFrais.deplacement + 
      newNoteFrais.hebergement + 
      newNoteFrais.restauration + 
      newNoteFrais.indemnites;
    
    // Simuler l'upload du fichier (dans une vraie application, cela serait fait vers un service de stockage)
    let fichierUrl = '';
    if (uploadedFile) {
      // Dans une vraie application, nous téléchargerions le fichier vers un serveur
      // et obtiendrions une URL. Ici, nous simulons simplement cette URL
      fichierUrl = URL.createObjectURL(uploadedFile);
    }

    addNoteFrais({
      dossierId: newNoteFrais.dossierId,
      inspecteurId: newNoteFrais.inspecteurId,
      date: newNoteFrais.date,
      description: `Note de frais - ${new Date(newNoteFrais.date).toLocaleDateString()}`,
      montant: total,
      status: newNoteFrais.status,
      deplacement: newNoteFrais.deplacement,
      hebergement: newNoteFrais.hebergement,
      restauration: newNoteFrais.restauration,
      indemnites: newNoteFrais.indemnites,
      commentaire: newNoteFrais.commentaire || undefined,
      fichierUrl: fichierUrl || undefined,
      notificationEnvoyee: false,
      operateurNotifie: false
    });
    
    toast({
      title: "Note de frais ajoutée",
      description: "La note de frais a été créée avec succès.",
    });
    
    // Réinitialiser le formulaire
    setNewNoteFrais({
      dossierId: '',
      inspecteurId: currentUser?.id || '',
      date: new Date().toISOString().split('T')[0],
      deplacement: 0,
      hebergement: 0,
      restauration: 0,
      indemnites: 0,
      status: 'en_attente',
      commentaire: '',
      description: '',
      montant: 0,
      fichierUrl: '',
      notificationEnvoyee: false,
      operateurNotifie: false
    });
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    setDialogOpen(false);
  };

  // Fonction pour valider une note de frais
  const handleValidateNoteFrais = (id: string) => {
    updateNoteFrais(id, { status: 'valide' });
    toast({
      title: "Note de frais validée",
      description: "La note de frais a été validée avec succès.",
    });
  };

  // Fonction pour rejeter une note de frais
  const handleRejectNoteFrais = (id: string) => {
    updateNoteFrais(id, { status: 'rejete' });
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
      case 'valide':
        return 'bg-green-500 text-white';
      case 'rejete':
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
      case 'valide':
        return 'Validée';
      case 'rejete':
        return 'Rejetée';
      default:
        return status;
    }
  };

  // Calculer le total d'une note de frais
  const calculerTotal = (note: NoteFrais) => {
    return (
      (note.deplacement || 0) + 
      (note.hebergement || 0) + 
      (note.restauration || 0) + 
      (note.indemnites || 0)
    );
  };

  // Afficher les détails d'une note
  const handleShowDetails = (note: NoteFrais) => {
    setSelectedNote(note);
    setDetailDialogOpen(true);
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/e1bf7151-3abe-4c2a-8037-71e791d77bf9.png" 
            alt="ANOR Logo" 
            className="h-14 mr-4" 
          />
          <h1 className="text-3xl font-bold text-certif-blue">Notes de frais</h1>
        </div>
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
                <label htmlFor="date" className="text-right font-medium text-sm">
                  Date
                </label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={newNoteFrais.date}
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
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="fichier" className="text-right font-medium text-sm">
                  Document
                </label>
                <div className="col-span-3">
                  <Input
                    id="fichier"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="col-span-3"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés: PDF, JPG, PNG (max 5 MB)
                  </p>
                </div>
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
              <SelectItem value="valide">Validée</SelectItem>
              <SelectItem value="rejete">Rejetée</SelectItem>
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
                <TableHead>Notification</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotesFrais.length > 0 ? (
                filteredNotesFrais.map((note) => {
                  const dossier = dossiers.find(d => d.id === note.dossierId);
                  const total = note.montant || calculerTotal(note);
                  
                  return (
                    <TableRow key={note.id}>
                      <TableCell>{new Date(note.date).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{dossier?.operateurNom}</TableCell>
                      <TableCell className="text-right">{note.deplacement?.toFixed(2) || '0.00'} €</TableCell>
                      <TableCell className="text-right">{note.hebergement?.toFixed(2) || '0.00'} €</TableCell>
                      <TableCell className="text-right">{note.restauration?.toFixed(2) || '0.00'} €</TableCell>
                      <TableCell className="text-right">{note.indemnites?.toFixed(2) || '0.00'} €</TableCell>
                      <TableCell className="text-right font-medium">{total.toFixed(2)} €</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(note.status)}>
                          {formatStatus(note.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {note.notificationEnvoyee ? (
                          note.operateurNotifie ? (
                            <Badge className="bg-green-500 text-white">Reçue</Badge>
                          ) : (
                            <Badge className="bg-yellow-500 text-white">Envoyée</Badge>
                          )
                        ) : (
                          <Badge className="bg-gray-400 text-white">Non envoyée</Badge>
                        )}
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
                          {note.status === 'valide' && note.notificationEnvoyee === false && (
                            <Button 
                              variant="outline" 
                              size="icon"
                              className="h-8 w-8 text-blue-500 hover:text-blue-700"
                              onClick={() => handleSendNotification(note.id)}
                              title="Envoyer une notification"
                            >
                              <Mail size={16} />
                            </Button>
                          )}
                          {note.notificationEnvoyee && !note.operateurNotifie && (
                            <Button 
                              variant="outline" 
                              size="icon"
                              className="h-8 w-8 text-green-500 hover:text-green-700"
                              onClick={() => handleMarkAsNotified(note.id)}
                              title="Marquer comme notifié"
                            >
                              <Check size={16} />
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleShowDetails(note)}
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
                  <TableCell colSpan={10} className="h-24 text-center">
                    Aucune note de frais trouvée
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Dialog for note details */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Détails de la note de frais</DialogTitle>
          </DialogHeader>
          {selectedNote && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Opérateur</p>
                  <p>{dossiers.find(d => d.id === selectedNote.dossierId)?.operateurNom}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p>{new Date(selectedNote.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Statut</p>
                  <Badge className={getStatusColor(selectedNote.status)}>
                    {formatStatus(selectedNote.status)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total</p>
                  <p className="font-bold">{(selectedNote.montant || calculerTotal(selectedNote)).toFixed(2)} €</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-4">
                <h3 className="font-medium mb-2">Détails des frais</h3>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-sm">Déplacement:</p>
                  <p className="text-sm text-right">{selectedNote.deplacement?.toFixed(2) || '0.00'} €</p>
                  <p className="text-sm">Hébergement:</p>
                  <p className="text-sm text-right">{selectedNote.hebergement?.toFixed(2) || '0.00'} €</p>
                  <p className="text-sm">Restauration:</p>
                  <p className="text-sm text-right">{selectedNote.restauration?.toFixed(2) || '0.00'} €</p>
                  <p className="text-sm">Indemnités:</p>
                  <p className="text-sm text-right">{selectedNote.indemnites?.toFixed(2) || '0.00'} €</p>
                </div>
              </div>

              {selectedNote.commentaire && (
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h3 className="font-medium mb-2">Commentaire</h3>
                  <p className="text-sm">{selectedNote.commentaire}</p>
                </div>
              )}

              {selectedNote.fichierUrl && (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-medium mb-2">Document joint</h3>
                  <div className="flex items-center">
                    <FileText size={20} className="mr-2 text-blue-500" />
                    <a 
                      href={selectedNote.fichierUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      Voir le document
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button>Fermer</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default NotesFrais;
