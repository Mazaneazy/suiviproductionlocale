import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileUploader } from '@/components/shared/FileUploader';
import { NoteFrais, PreuvePaiement } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface PaymentReceiptFormProps {
  noteFrais: NoteFrais;
  onPreuveSubmitted: () => void;
  onCancel: () => void;
}

const PaymentReceiptForm: React.FC<PaymentReceiptFormProps> = ({
  noteFrais,
  onPreuveSubmitted,
  onCancel
}) => {
  const { toast } = useToast();
  const [montant, setMontant] = useState<number>(noteFrais.montant);
  const [reference, setReference] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [commentaire, setCommentaire] = useState<string>('');
  const [fichier, setFichier] = useState<File | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fichier) {
      toast({
        variant: "destructive",
        title: "Fichier manquant",
        description: "Veuillez télécharger un reçu de paiement."
      });
      return;
    }
    
    if (!reference) {
      toast({
        variant: "destructive",
        title: "Référence manquante",
        description: "Veuillez saisir une référence de paiement."
      });
      return;
    }
    
    // Create payment proof
    const preuvePaiement: Partial<PreuvePaiement> = {
      notefrais_id: noteFrais.id,
      date: date,
      montant: montant,
      referencePaiement: reference,
      commentaire: commentaire,
      uploaded_by: 'client', // Should be actual user ID
      validation_status: 'en_attente',
    };
    
    // In a real app, here we would upload the file and save the payment proof
    console.log("Submitting payment proof:", preuvePaiement);
    console.log("With file:", fichier.name);
    
    toast({
      title: "Paiement enregistré",
      description: "Votre preuve de paiement a été transmise avec succès et sera vérifiée sous peu."
    });
    
    // Mark notification as handled
    if (noteFrais.notification_envoyee || noteFrais.notificationEnvoyee) {
      // Update notification status in a real app
    }
    
    onPreuveSubmitted();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="montant">Montant versé (FCFA)</Label>
        <Input
          type="number"
          id="montant"
          value={montant}
          onChange={(e) => setMontant(Number(e.target.value))}
        />
      </div>
      <div>
        <Label htmlFor="reference">Référence de paiement</Label>
        <Input
          type="text"
          id="reference"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="date">Date de paiement</Label>
        <Input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="commentaire">Commentaire</Label>
        <Textarea
          id="commentaire"
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="fichier">Reçu de paiement</Label>
        <FileUploader setFile={setFichier} />
      </div>
      <div className="flex justify-between">
        <Button variant="ghost" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          Envoyer
        </Button>
      </div>
    </form>
  );
};

export default PaymentReceiptForm;
