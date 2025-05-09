
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/DataContext';
import { Certificat, Dossier } from '@/types';
import { useAuth } from '@/hooks/useAuth';

interface CreateResultDialogProps {
  dossier: Dossier;
}

const CreateResultDialog: React.FC<CreateResultDialogProps> = ({ dossier }) => {
  const { addCertificat } = useData();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [numeroCertificat, setNumeroCertificat] = useState('');
  const [entreprise, setEntreprise] = useState(dossier.operateurNom);
  const [produit, setProduit] = useState(dossier.typeProduit);
  const [dateDelivrance, setDateDelivrance] = useState<Date | undefined>(new Date());
  const [dateExpiration, setDateExpiration] = useState<Date | undefined>(new Date(new Date().setFullYear(new Date().getFullYear() + 1)));
  const [status, setStatus] = useState<'actif' | 'expire' | 'suspendu' | 'revoque'>('actif');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!numeroCertificat || !entreprise || !produit || !dateDelivrance || !dateExpiration) {
      toast({
        variant: "destructive",
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs obligatoires.",
      });
      return;
    }

    const certificat = {
      dossierId: dossier.id,
      numero: numeroCertificat,
      entreprise: entreprise,
      produit: produit,
      dateDelivrance: dateDelivrance.toISOString(),
      dateExpiration: dateExpiration.toISOString(),
      status: status,
      responsableQualiteId: currentUser?.id || "unknown" // Add the required field
    };

    addCertificat(certificat);

    toast({
      title: "Certificat créé",
      description: "Le certificat a été créé avec succès.",
    });

    setOpen(false);
  };

  const handleGenerateDemo = () => {
    const certificat = {
      dossierId: dossier.id,
      numero: `CERT-DEMO-${Math.floor(Math.random() * 1000)}`,
      entreprise: dossier.operateurNom,
      produit: dossier.typeProduit,
      dateDelivrance: new Date().toISOString(),
      dateExpiration: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
      status: 'actif' as 'actif',
      responsableQualiteId: currentUser?.id || "unknown"
    };

    addCertificat(certificat);

    toast({
      title: "Certificat de démonstration créé",
      description: "Un certificat de démonstration a été créé avec succès.",
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Créer un certificat</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un certificat</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="numero">Numéro</Label>
            <Input id="numero" value={numeroCertificat} onChange={(e) => setNumeroCertificat(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="entreprise">Entreprise</Label>
            <Input id="entreprise" value={entreprise} onChange={(e) => setEntreprise(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="produit">Produit</Label>
            <Input id="produit" value={produit} onChange={(e) => setProduit(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="delivrance">Date de délivrance</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !dateDelivrance && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateDelivrance ? format(dateDelivrance, "PPP") : <span>Choisir une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateDelivrance}
                  onSelect={setDateDelivrance}
                  disabled={(date) =>
                    date > new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expiration">Date d'expiration</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !dateExpiration && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateExpiration ? format(dateExpiration, "PPP") : <span>Choisir une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateExpiration}
                  onSelect={setDateExpiration}
                  disabled={(date) =>
                    date < new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status">Statut</Label>
            <select id="status" 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value as 'actif' | 'expire' | 'suspendu' | 'revoque')} 
                    className="col-span-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option value="actif">Actif</option>
              <option value="expire">Expiré</option>
              <option value="suspendu">Suspendu</option>
              <option value="revoque">Révoqué</option>
            </select>
          </div>
          <div className="flex justify-end">
            <Button type="submit">
              Créer
            </Button>
          </div>
        </form>
        <div className="flex justify-end">
          <Button type="button" variant="secondary" onClick={handleGenerateDemo}>
            Générer un certificat de démonstration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateResultDialog;
