
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MembreComite, ComiteTechnique, Dossier } from '@/types';

interface UseComiteTechniqueProps {
  dossier: Dossier;
  existingComite?: ComiteTechnique | null;
  onSave: (comite: ComiteTechnique) => void;
}

export const useComiteTechnique = ({ dossier, existingComite, onSave }: UseComiteTechniqueProps) => {
  const { toast } = useToast();
  const [membres, setMembres] = useState<MembreComite[]>(
    existingComite?.membres || dossier.comiteTechnique?.membres || []
  );
  const [chefComite, setChefComite] = useState<MembreComite | null>(
    existingComite?.chefComite || dossier.comiteTechnique?.chefComite || null
  );
  const [nouveauMembre, setNouveauMembre] = useState({
    nom: '',
    role: 'inspecteur' as 'chef' | 'inspecteur' | 'analyste' | 'expert',
    specialite: '',
  });

  const handleMembreChange = (field: string, value: string) => {
    setNouveauMembre({ ...nouveauMembre, [field]: value });
  };

  const handleAddMembre = () => {
    if (!nouveauMembre.nom) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir le nom du membre",
        variant: "destructive",
      });
      return;
    }

    const membreToAdd: MembreComite = {
      id: Math.random().toString(36).substring(2, 9),
      ...nouveauMembre
    };

    // Si le rôle est chef, remplacer le chef actuel
    if (nouveauMembre.role === 'chef') {
      setChefComite(membreToAdd);
      // Vérifier si l'ancien chef est dans la liste des membres pour le rétrograder
      if (chefComite) {
        const ancienChef = { ...chefComite, role: 'expert' as const };
        setMembres([...membres.filter(m => m.id !== chefComite.id), ancienChef]);
      }
    } else {
      setMembres([...membres, membreToAdd]);
    }

    setNouveauMembre({
      nom: '',
      role: 'inspecteur' as 'chef' | 'inspecteur' | 'analyste' | 'expert',
      specialite: '',
    });

    toast({
      title: "Membre ajouté",
      description: `${membreToAdd.nom} a été ajouté au pilote technique`,
    });
  };

  const handleRemoveMembre = (id: string) => {
    setMembres(membres.filter(m => m.id !== id));
    
    toast({
      title: "Membre retiré",
      description: "Le membre a été retiré du pilote technique",
    });
  };

  const handleSaveComite = () => {
    if (!chefComite) {
      toast({
        title: "Erreur",
        description: "Veuillez désigner un chef de pilote",
        variant: "destructive",
      });
      return;
    }

    const comite: ComiteTechnique = {
      id: existingComite?.id || dossier.comiteTechnique?.id || Math.random().toString(36).substring(2, 9),
      dossierId: dossier.id,
      dateCreation: existingComite?.dateCreation || new Date().toISOString(),
      chefComite,
      membres,
    };

    onSave(comite);
    
    toast({
      title: "Pilote technique enregistré",
      description: "Le pilote technique a été enregistré avec succès",
    });
  };

  return {
    membres,
    chefComite,
    nouveauMembre,
    handleMembreChange,
    handleAddMembre,
    handleRemoveMembre,
    handleSaveComite,
  };
};
