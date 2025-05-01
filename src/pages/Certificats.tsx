
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { FileCheck, PlusCircle, DownloadCloud, AlertCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';

const Certificats = () => {
  const { certificats, dossiers, inspections, addCertificat, updateCertificat } = useData();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('tous');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('certificat');
  
  // État pour le nouveau résultat (certificat, non-conformité ou actions correctives)
  const [newResult, setNewResult] = useState({
    type: 'certificat',
    dossierId: '',
    entreprise: '',
    produit: '',
    numero: `CERT-${new Date().getFullYear()}-${certificats.length + 1}`.padStart(8, '0'),
    dateDelivrance: new Date().toISOString().split('T')[0],
    dateExpiration: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'actif' as 'actif' | 'suspendu' | 'retire' | 'expire',
    commentaire: ''
  });

  // Obtenir les dossiers éligibles pour la certification (avec inspection conforme)
  const dossiersEligibles = dossiers
    .filter(dossier => {
      const dossierInspections = inspections.filter(i => i.dossierId === dossier.id);
      const hasInspection = dossierInspections.length > 0;
      const hasCertificat = certificats.some(c => c.dossierId === dossier.id && c.status === 'actif');
      
      return hasInspection && !hasCertificat && dossier.status !== 'rejete';
    });

  // Filtrer les certificats en fonction des critères de recherche
  const filteredCertificats = certificats.filter(certificat => {
    const matchesSearch = 
      certificat.entreprise.toLowerCase().includes(searchTerm.toLowerCase()) ||
      certificat.produit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      certificat.numero.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'tous' || certificat.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Fonction pour mettre à jour les champs du nouveau résultat
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewResult({
      ...newResult,
      [name]: value,
    });
  };

  // Fonction pour mettre à jour le type de résultat
  const handleTypeChange = (type: string) => {
    setCurrentTab(type);
    setNewResult({
      ...newResult,
      type,
      numero: type === 'certificat' 
        ? `CERT-${new Date().getFullYear()}-${certificats.length + 1}`.padStart(8, '0')
        : type === 'non_conformite'
          ? `NC-${new Date().getFullYear()}-${certificats.length + 1}`.padStart(8, '0')
          : `AC-${new Date().getFullYear()}-${certificats.length + 1}`.padStart(8, '0')
    });
  };

  // Fonction pour mettre à jour les informations quand on change le dossier
  const handleDossierChange = (dossierId: string) => {
    const dossier = dossiers.find(d => d.id === dossierId);
    
    if (dossier) {
      setNewResult({
        ...newResult,
        dossierId,
        entreprise: dossier.operateurNom,
        produit: dossier.typeProduit,
      });
    }
  };

  // Fonction pour ajouter un nouveau certificat ou résultat
  const handleAddResult = () => {
    // Vérifier que tous les champs obligatoires sont remplis
    if (!newResult.dossierId) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner un dossier.",
      });
      return;
    }

    // Pour un certificat
    if (newResult.type === 'certificat') {
      const certificat = {
        dossierId: newResult.dossierId,
        numero: newResult.numero,
        entreprise: newResult.entreprise,
        produit: newResult.produit,
        dateDelivrance: newResult.dateDelivrance,
        dateExpiration: newResult.dateExpiration,
        status: newResult.status
      };
      
      addCertificat(certificat);
      
      toast({
        title: "Certificat de conformité émis",
        description: `Le certificat pour "${newResult.entreprise}" a été émis et attend validation.`,
      });
    } else {
      // Pour les autres types de résultats (non-conformité ou actions correctives)
      // Dans un système réel, vous auriez une autre fonction pour gérer ces types
      // Pour l'instant, on simule avec la même fonction
      const certificat = {
        dossierId: newResult.dossierId,
        numero: newResult.numero,
        entreprise: newResult.entreprise,
        produit: newResult.produit,
        dateDelivrance: newResult.dateDelivrance,
        dateExpiration: newResult.dateExpiration,
        status: 'actif' as 'actif'
      };
      
      addCertificat(certificat);
      
      const resultType = newResult.type === 'non_conformite' 
        ? "Rapport de non-conformité" 
        : "Lettre d'actions correctives";
        
      toast({
        title: `${resultType} émis`,
        description: `Le document pour "${newResult.entreprise}" a été émis et attend validation.`,
      });
    }
    
    // Réinitialiser le formulaire
    setNewResult({
      type: 'certificat',
      dossierId: '',
      entreprise: '',
      produit: '',
      numero: `CERT-${new Date().getFullYear()}-${certificats.length + 2}`.padStart(8, '0'),
      dateDelivrance: new Date().toISOString().split('T')[0],
      dateExpiration: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'actif',
      commentaire: ''
    });
    
    setDialogOpen(false);
  };

  // Fonction pour suspendre un certificat
  const handleSuspendCertificat = (id: string) => {
    updateCertificat(id, { status: 'suspendu' });
    toast({
      title: "Document suspendu",
      description: "Le document a été suspendu avec succès.",
    });
  };

  // Fonction pour réactiver un certificat suspendu
  const handleReactivateCertificat = (id: string) => {
    updateCertificat(id, { status: 'actif' });
    toast({
      title: "Document réactivé",
      description: "Le document a été réactivé avec succès.",
    });
  };

  // Fonction pour simuler le téléchargement d'un certificat
  const handleDownloadCertificat = (certificat: any) => {
    toast({
      title: "Téléchargement du document",
      description: `Le document ${certificat.numero} a été téléchargé.`,
    });
  };

  // Fonction pour obtenir la couleur du badge en fonction du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'actif':
        return 'bg-green-500 text-white';
      case 'suspendu':
        return 'bg-yellow-500 text-white';
      case 'retire':
        return 'bg-red-500 text-white';
      case 'expire':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Fonction pour formater le statut pour l'affichage
  const formatStatus = (status: string) => {
    switch (status) {
      case 'actif':
        return 'Actif';
      case 'suspendu':
        return 'Suspendu';
      case 'retire':
        return 'Retiré';
      case 'expire':
        return 'Expiré';
      default:
        return status;
    }
  };

  // Vérifier si un certificat est proche de l'expiration (moins de 30 jours)
  const isNearExpiration = (dateExpiration: string) => {
    const now = new Date();
    const expiration = new Date(dateExpiration);
    const diffTime = expiration.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 30 && diffDays > 0;
  };

  // Déterminer si l'utilisateur peut créer des documents
  const canCreateDocuments = currentUser?.role === 'certificats' || 
                           currentUser?.role === 'directeur' ||
                           currentUser?.role === 'admin' ||
                           currentUser?.role === 'directeur_general';

  const getResultTypeLabel = (numero: string) => {
    if (numero.startsWith('CERT')) return 'Certificat';
    if (numero.startsWith('NC')) return 'Non-conformité';
    if (numero.startsWith('AC')) return 'Actions correctives';
    return 'Document';
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-certif-blue">Résultats d'évaluation</h1>
        {canCreateDocuments && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-certif-green hover:bg-certif-green/90">
                <PlusCircle className="mr-2" size={16} />
                Nouveau document
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Créer un document de résultat</DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="certificat" value={currentTab} onValueChange={handleTypeChange}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="certificat">Certificat</TabsTrigger>
                  <TabsTrigger value="non_conformite">Non-conformité</TabsTrigger>
                  <TabsTrigger value="actions_correctives">Actions correctives</TabsTrigger>
                </TabsList>
                
                <TabsContent value="certificat" className="pt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="dossierId" className="text-right font-medium text-sm">
                        Dossier*
                      </label>
                      <Select
                        value={newResult.dossierId}
                        onValueChange={handleDossierChange}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Sélectionner un dossier" />
                        </SelectTrigger>
                        <SelectContent>
                          {dossiersEligibles.map((dossier) => (
                            <SelectItem key={dossier.id} value={dossier.id}>
                              {dossier.operateurNom} - {dossier.typeProduit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="numero" className="text-right font-medium text-sm">
                        Numéro
                      </label>
                      <Input
                        id="numero"
                        name="numero"
                        value={newResult.numero}
                        onChange={handleInputChange}
                        className="col-span-3"
                        readOnly
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="dateDelivrance" className="text-right font-medium text-sm">
                        Date de délivrance
                      </label>
                      <Input
                        id="dateDelivrance"
                        name="dateDelivrance"
                        type="date"
                        value={newResult.dateDelivrance}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="dateExpiration" className="text-right font-medium text-sm">
                        Date d'expiration
                      </label>
                      <Input
                        id="dateExpiration"
                        name="dateExpiration"
                        type="date"
                        value={newResult.dateExpiration}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="non_conformite" className="pt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="dossierId" className="text-right font-medium text-sm">
                        Dossier*
                      </label>
                      <Select
                        value={newResult.dossierId}
                        onValueChange={handleDossierChange}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Sélectionner un dossier" />
                        </SelectTrigger>
                        <SelectContent>
                          {dossiersEligibles.map((dossier) => (
                            <SelectItem key={dossier.id} value={dossier.id}>
                              {dossier.operateurNom} - {dossier.typeProduit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="numero" className="text-right font-medium text-sm">
                        Numéro
                      </label>
                      <Input
                        id="numero"
                        name="numero"
                        value={newResult.numero}
                        className="col-span-3"
                        readOnly
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-start gap-4">
                      <label htmlFor="commentaire" className="text-right font-medium text-sm pt-2">
                        Raisons de non-conformité
                      </label>
                      <Textarea
                        id="commentaire"
                        name="commentaire"
                        value={newResult.commentaire}
                        onChange={handleInputChange}
                        className="col-span-3"
                        rows={4}
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="dateDelivrance" className="text-right font-medium text-sm">
                        Date du rapport
                      </label>
                      <Input
                        id="dateDelivrance"
                        name="dateDelivrance"
                        type="date"
                        value={newResult.dateDelivrance}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="actions_correctives" className="pt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="dossierId" className="text-right font-medium text-sm">
                        Dossier*
                      </label>
                      <Select
                        value={newResult.dossierId}
                        onValueChange={handleDossierChange}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Sélectionner un dossier" />
                        </SelectTrigger>
                        <SelectContent>
                          {dossiersEligibles.map((dossier) => (
                            <SelectItem key={dossier.id} value={dossier.id}>
                              {dossier.operateurNom} - {dossier.typeProduit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="numero" className="text-right font-medium text-sm">
                        Numéro
                      </label>
                      <Input
                        id="numero"
                        name="numero"
                        value={newResult.numero}
                        className="col-span-3"
                        readOnly
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-start gap-4">
                      <label htmlFor="commentaire" className="text-right font-medium text-sm pt-2">
                        Actions correctives requises
                      </label>
                      <Textarea
                        id="commentaire"
                        name="commentaire"
                        value={newResult.commentaire}
                        onChange={handleInputChange}
                        className="col-span-3"
                        rows={4}
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="dateDelivrance" className="text-right font-medium text-sm">
                        Date d'émission
                      </label>
                      <Input
                        id="dateDelivrance"
                        name="dateDelivrance"
                        type="date"
                        value={newResult.dateDelivrance}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="dateExpiration" className="text-right font-medium text-sm">
                        Date limite
                      </label>
                      <Input
                        id="dateExpiration"
                        name="dateExpiration"
                        type="date"
                        value={newResult.dateExpiration}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <DialogFooter className="mt-6">
                <DialogClose asChild>
                  <Button variant="outline">Annuler</Button>
                </DialogClose>
                <Button onClick={handleAddResult} className="bg-certif-green hover:bg-certif-green/90">
                  Émettre le document
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Input
              placeholder="Rechercher par entreprise, produit ou numéro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <FileCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les statuts</SelectItem>
              <SelectItem value="actif">Actif</SelectItem>
              <SelectItem value="suspendu">Suspendu</SelectItem>
              <SelectItem value="retire">Retiré</SelectItem>
              <SelectItem value="expire">Expiré</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Numéro</TableHead>
                <TableHead>Entreprise</TableHead>
                <TableHead>Produit</TableHead>
                <TableHead>Date d'émission</TableHead>
                <TableHead>Date limite/expiration</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCertificats.length > 0 ? (
                filteredCertificats.map((certificat) => (
                  <TableRow key={certificat.id}>
                    <TableCell>{getResultTypeLabel(certificat.numero)}</TableCell>
                    <TableCell className="font-mono">{certificat.numero}</TableCell>
                    <TableCell className="font-medium">{certificat.entreprise}</TableCell>
                    <TableCell>{certificat.produit}</TableCell>
                    <TableCell>{new Date(certificat.dateDelivrance).toLocaleDateString()}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center">
                        {isNearExpiration(certificat.dateExpiration) && (
                          <AlertCircle className="mr-1 text-yellow-500" size={16} />
                        )}
                        {new Date(certificat.dateExpiration).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(certificat.status)}>
                        {formatStatus(certificat.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {certificat.status === 'actif' && canCreateDocuments && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                            onClick={() => handleSuspendCertificat(certificat.id)}
                          >
                            Suspendre
                          </Button>
                        )}
                        {certificat.status === 'suspendu' && canCreateDocuments && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => handleReactivateCertificat(certificat.id)}
                          >
                            Réactiver
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleDownloadCertificat(certificat)}
                        >
                          <DownloadCloud size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    Aucun document trouvé
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

export default Certificats;
