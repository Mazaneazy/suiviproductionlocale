
import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FileUp } from 'lucide-react';
import { NoteFrais, PreuvePaiement } from '@/types';
import { generateId } from '@/contexts/data/utils';

const PaymentReceiptForm = () => {
  const { notesFrais, dossiers, updateNoteFrais } = useData();
  const { toast } = useToast();
  const [selectedNoteFrais, setSelectedNoteFrais] = useState<string>('');
  const [reference, setReference] = useState<string>('');
  const [montant, setMontant] = useState<number>(0);
  const [commentaire, setCommentaire] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  
  // Filter to show only notes de frais that have been notified but not paid
  const unpaidNotesFrais = notesFrais.filter(note => 
    note.notification_envoyee && !note.acquitte
  );
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedNoteFrais || !reference || montant <= 0 || !file) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }
    
    const selectedNote = notesFrais.find(note => note.id === selectedNoteFrais);
    if (!selectedNote) return;
    
    // In a real app, we would upload the file to a server
    // Here we simulate this by creating a local URL
    const fichierUrl = `paiement_${Date.now()}_${file.name}`;
    
    // Create payment receipt
    const preuvePaiement: PreuvePaiement = {
      id: generateId(),
      notefrais_id: selectedNoteFrais,
      dossierId: selectedNote.dossierId,
      date: new Date().toISOString(),
      montant: montant,
      referencePaiement: reference,
      fichier_url: fichierUrl,
      status: 'recu',
      commentaires: commentaire
    };
    
    // Update note de frais status
    updateNoteFrais(selectedNoteFrais, { 
      acquitte: true 
    });
    
    // In a real app, we would save the preuvePaiement to the database
    // Here we just show a success message
    
    toast({
      title: "Preuve de paiement enregistrée",
      description: "La preuve de paiement a été enregistrée avec succès",
    });
    
    // Reset form
    setSelectedNoteFrais('');
    setReference('');
    setMontant(0);
    setCommentaire('');
    setFile(null);
  };
  
  const getCompanyName = (dossierId: string) => {
    const dossier = dossiers.find(d => d.id === dossierId);
    return dossier ? dossier.operateurNom : 'Entreprise inconnue';
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Réception des preuves de paiement</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="note-frais">Note de frais</Label>
            <Select 
              value={selectedNoteFrais} 
              onValueChange={setSelectedNoteFrais}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une note de frais" />
              </SelectTrigger>
              <SelectContent>
                {unpaidNotesFrais.map((note) => (
                  <SelectItem key={note.id} value={note.id}>
                    {getCompanyName(note.dossierId)} - {note.montant.toLocaleString()} FCFA
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reference">Référence du paiement</Label>
              <Input 
                id="reference" 
                type="text" 
                value={reference} 
                onChange={e => setReference(e.target.value)}
                placeholder="Ex: VIR-12345"
              />
            </div>
            
            <div>
              <Label htmlFor="montant">Montant (FCFA)</Label>
              <Input 
                id="montant" 
                type="number" 
                value={montant || ''} 
                onChange={e => setMontant(Number(e.target.value))}
                placeholder="0"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="commentaire">Commentaire</Label>
            <Textarea 
              id="commentaire" 
              value={commentaire} 
              onChange={e => setCommentaire(e.target.value)}
              placeholder="Informations complémentaires sur le paiement"
            />
          </div>
          
          <div>
            <Label htmlFor="file">Pièce justificative</Label>
            <div className="mt-1 flex items-center">
              <label className="block w-full">
                <span className="sr-only">Choisir un fichier</span>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-certif-blue
                    hover:file:bg-blue-100"
                />
              </label>
            </div>
            {file && (
              <p className="mt-2 text-sm text-gray-500">
                Fichier sélectionné: {file.name}
              </p>
            )}
          </div>
          
          <Button type="submit" className="bg-certif-blue hover:bg-certif-blue/90">
            <FileUp className="mr-2 h-4 w-4" />
            Enregistrer la preuve de paiement
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentReceiptForm;
