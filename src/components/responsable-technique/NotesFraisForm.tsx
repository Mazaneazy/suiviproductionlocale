
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/DataContext';
import { useParametresEvaluation } from '@/hooks/useParametresEvaluation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Dossier } from '@/types';
import { FileCog } from 'lucide-react';
import ParametresEvaluationSection from './parametres/ParametresEvaluationSection';

interface NotesFraisFormProps {
  dossier: Dossier;
  onNoteFraisCreated: () => void;
}

const NotesFraisForm: React.FC<NotesFraisFormProps> = ({ dossier, onNoteFraisCreated }) => {
  const { toast } = useToast();
  const { addNoteFrais } = useData();
  
  const {
    parametres,
    selectedParametres,
    totalPrix,
    addParametre,
    removeParametre,
    toggleParametre
  } = useParametresEvaluation(dossier.id);
  
  const [fraisGestion, setFraisGestion] = useState(50000);
  const [fraisInspection, setFraisInspection] = useState(75000);
  const [fraisSurveillance, setFraisSurveillance] = useState(40000);
  const [total, setTotal] = useState(0);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculer le total
  useEffect(() => {
    const newTotal = totalPrix + fraisGestion + fraisInspection + fraisSurveillance;
    setTotal(newTotal);
  }, [totalPrix, fraisGestion, fraisInspection, fraisSurveillance]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (selectedParametres.length === 0) {
      toast({
        variant: "destructive",
        title: "Aucun paramètre sélectionné",
        description: "Veuillez sélectionner au moins un paramètre à évaluer.",
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Créer la note de frais
      const newNoteFrais = {
        dossierId: dossier.id,
        inspecteurId: 'resp_technique',
        date: new Date().toISOString().split('T')[0],
        dateCreation: new Date().toISOString(),
        description: description || `Note de frais pour le dossier ${dossier.operateurNom}`,
        montant: total,
        status: 'en_attente' as const,
        parametresEvaluation: selectedParametres,
        fraisGestion,
        fraisInspection,
        fraisAnalyses: totalPrix,
        fraisSurveillance,
        acquitte: false
      };
      
      addNoteFrais(newNoteFrais);
      
      // Mise à jour du dossier avec les paramètres d'évaluation sélectionnés
      // Cette partie serait normalement gérée par updateDossier, mais pour simplifier
      
      toast({
        title: "Note de frais créée",
        description: "La note de frais a été créée avec succès. Elle sera transmise au Directeur pour validation.",
      });
      
      onNoteFraisCreated();
    } catch (error) {
      console.error("Erreur lors de la création de la note de frais:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la note de frais.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ParametresEvaluationSection
        parametres={parametres}
        selectedParametres={selectedParametres}
        onAddParametre={addParametre}
        onRemoveParametre={removeParametre}
        onToggleParametre={toggleParametre}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-certif-blue mb-4">Frais additionnels</h3>
          <Card className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fraisGestion">Frais de gestion (FCFA)</Label>
              <Input
                id="fraisGestion"
                type="number"
                value={fraisGestion}
                onChange={(e) => setFraisGestion(Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fraisInspection">Frais d'inspection et échantillonage (FCFA)</Label>
              <Input
                id="fraisInspection"
                type="number"
                value={fraisInspection}
                onChange={(e) => setFraisInspection(Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fraisSurveillance">Frais de surveillance (FCFA)</Label>
              <Input
                id="fraisSurveillance"
                type="number"
                value={fraisSurveillance}
                onChange={(e) => setFraisSurveillance(Number(e.target.value))}
              />
            </div>
          </Card>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-certif-blue mb-4">Récapitulatif</h3>
          <Card className="p-4 space-y-4">
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span>Analyses et essais:</span>
                <span className="font-medium">{totalPrix.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Frais de gestion:</span>
                <span>{fraisGestion.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Inspection et échantillonage:</span>
                <span>{fraisInspection.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Frais de surveillance:</span>
                <span>{fraisSurveillance.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-certif-blue">
                <span>Total:</span>
                <span>{total.toLocaleString()} FCFA</span>
              </div>
            </div>
          </Card>
          
          <div className="mt-4 space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description de la note de frais"
              className="h-24"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end pt-4 border-t">
        <Button type="submit" disabled={isSubmitting} className="bg-certif-green hover:bg-certif-green/90">
          {isSubmitting ? (
            <>Création en cours...</>
          ) : (
            <>
              <FileCog className="mr-2" size={16} />
              Créer la note de frais
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default NotesFraisForm;
