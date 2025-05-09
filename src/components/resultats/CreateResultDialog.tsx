
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/DataContext';
import { Dossier, Certificat, Inspection } from '@/types';

interface CreateResultDialogProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  dossiersEligibles: Dossier[];
}

const CreateResultDialog: React.FC<CreateResultDialogProps> = ({ 
  dialogOpen, 
  setDialogOpen,
  dossiersEligibles 
}) => {
  const { addCertificat, certificats } = useData();
  const { toast } = useToast();
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
    const dossier = dossiersEligibles.find(d => d.id === dossierId);
    
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

  return (
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
  );
};

export default CreateResultDialog;
