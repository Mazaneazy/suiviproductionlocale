
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Parametre {
  nom: string;
  prix: number;
}

export function useParametresEvaluation(dossierId?: string) {
  const { toast } = useToast();
  const [parametres, setParametres] = useState<Parametre[]>([
    { nom: 'pH', prix: 15000 },
    { nom: 'Viscosité', prix: 20000 },
    { nom: 'Densité', prix: 18000 },
    { nom: 'Point d\'éclair', prix: 25000 },
    { nom: 'Teneur en eau', prix: 22000 },
    { nom: 'Résistance à la traction', prix: 30000 },
  ]);
  const [selectedParametres, setSelectedParametres] = useState<string[]>([]);
  const [totalPrix, setTotalPrix] = useState(0);

  // Calculer le total des prix des paramètres sélectionnés
  useEffect(() => {
    const total = parametres
      .filter(p => selectedParametres.includes(p.nom))
      .reduce((sum, p) => sum + p.prix, 0);
    setTotalPrix(total);
  }, [parametres, selectedParametres]);

  // Ajouter un nouveau paramètre
  const addParametre = (parametre: Parametre) => {
    if (parametres.some(p => p.nom === parametre.nom)) {
      toast({
        variant: "destructive",
        title: "Paramètre existant",
        description: `Un paramètre avec le nom "${parametre.nom}" existe déjà.`,
      });
      return;
    }
    
    setParametres([...parametres, parametre]);
    toast({
      title: "Paramètre ajouté",
      description: `Le paramètre "${parametre.nom}" a été ajouté avec succès.`,
    });
  };

  // Supprimer un paramètre
  const removeParametre = (index: number) => {
    const parametreToRemove = parametres[index];
    
    // Vérifier si le paramètre est sélectionné
    if (selectedParametres.includes(parametreToRemove.nom)) {
      // Désélectionner le paramètre
      setSelectedParametres(selectedParametres.filter(p => p !== parametreToRemove.nom));
    }
    
    setParametres(parametres.filter((_, i) => i !== index));
    toast({
      title: "Paramètre supprimé",
      description: `Le paramètre "${parametreToRemove.nom}" a été supprimé.`,
    });
  };

  // Toggle la sélection d'un paramètre
  const toggleParametre = (parametre: string) => {
    if (selectedParametres.includes(parametre)) {
      setSelectedParametres(selectedParametres.filter(p => p !== parametre));
    } else {
      setSelectedParametres([...selectedParametres, parametre]);
    }
  };

  return {
    parametres,
    selectedParametres,
    totalPrix,
    addParametre,
    removeParametre,
    toggleParametre,
    setSelectedParametres
  };
}
