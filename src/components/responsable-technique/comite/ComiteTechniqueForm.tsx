import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Dossier, MembreComite, ComiteTechnique } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { User, UserPlus, UserX, Award, Users } from 'lucide-react';
import MembreComiteCard from './MembreComiteCard';

interface ComiteTechniqueFormProps {
  dossier: Dossier;
  onSave: (comite: ComiteTechnique) => void;
  existingComite?: ComiteTechnique | null;
}

const ROLES_COMITE = [
  { value: 'chef', label: 'Chef du comité', icon: <Award className="h-4 w-4" /> },
  { value: 'inspecteur', label: 'Inspecteur', icon: <User className="h-4 w-4" /> },
  { value: 'analyste', label: 'Analyste', icon: <User className="h-4 w-4" /> },
  { value: 'expert', label: 'Expert technique', icon: <User className="h-4 w-4" /> },
];

const ComiteTechniqueForm: React.FC<ComiteTechniqueFormProps> = ({ dossier, onSave, existingComite }) => {
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
      description: `${membreToAdd.nom} a été ajouté au comité technique`,
    });
  };

  const handleRemoveMembre = (id: string) => {
    setMembres(membres.filter(m => m.id !== id));
    
    toast({
      title: "Membre retiré",
      description: "Le membre a été retiré du comité technique",
    });
  };

  const handleSaveComite = () => {
    if (!chefComite) {
      toast({
        title: "Erreur",
        description: "Veuillez désigner un chef de comité",
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
      title: "Comité enregistré",
      description: "Le comité technique a été enregistré avec succès",
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2 text-certif-blue" />
          Composition du comité technique
        </h3>
        
        <div className="space-y-4">
          {/* Formulaire d'ajout de membre */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom du membre</Label>
              <Input 
                id="nom"
                value={nouveauMembre.nom}
                onChange={(e) => setNouveauMembre({ ...nouveauMembre, nom: e.target.value })}
                placeholder="Nom complet"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rôle</Label>
              <Select 
                value={nouveauMembre.role}
                onValueChange={(value: 'chef' | 'inspecteur' | 'analyste' | 'expert') => 
                  setNouveauMembre({ ...nouveauMembre, role: value })
                }
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES_COMITE.map(role => (
                    <SelectItem key={role.value} value={role.value} className="flex items-center">
                      <div className="flex items-center">
                        {role.icon}
                        <span className="ml-2">{role.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialite">Spécialité (optionnel)</Label>
              <Input 
                id="specialite"
                value={nouveauMembre.specialite}
                onChange={(e) => setNouveauMembre({ ...nouveauMembre, specialite: e.target.value })}
                placeholder="Ex: Chimie analytique"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleAddMembre} 
              variant="outline" 
              className="flex items-center"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Ajouter le membre
            </Button>
          </div>
        </div>
      </div>
      
      {/* Affichage du chef de comité */}
      {chefComite && (
        <div className="bg-certif-lightblue p-4 rounded-lg border border-certif-blue">
          <h4 className="text-md font-medium mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2 text-certif-blue" />
            Chef du comité
          </h4>
          <MembreComiteCard membre={chefComite} isChef={true} />
        </div>
      )}
      
      {/* Liste des membres du comité */}
      {membres.length > 0 && (
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="text-md font-medium mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-certif-blue" />
            Membres du comité ({membres.length})
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            {membres.map(membre => (
              <MembreComiteCard 
                key={membre.id} 
                membre={membre} 
                onRemove={handleRemoveMembre} 
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Bouton d'enregistrement */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveComite} 
          className="bg-certif-blue hover:bg-certif-blue/90"
        >
          Enregistrer le comité technique
        </Button>
      </div>
    </div>
  );
};

export default ComiteTechniqueForm;
