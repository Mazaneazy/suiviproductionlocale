
import React, { useState } from 'react';
import { Send, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Dossier, RapportInspection, AvisDecision } from '@/types';
import { generateId } from '@/contexts/data/utils';

interface AvisDecisionTabProps {
  dossier: Dossier | null;
  rapports: RapportInspection[];
  onAvisSubmitted: () => void;
}

const AvisDecisionTab: React.FC<AvisDecisionTabProps> = ({ dossier, rapports, onAvisSubmitted }) => {
  const { toast } = useToast();
  const [selectedRapport, setSelectedRapport] = useState<string>('');
  const [contenu, setContenu] = useState<string>('');
  const [resultat, setResultat] = useState<'favorable' | 'defavorable' | 'avec_reserves'>('favorable');
  const [commentaires, setCommentaires] = useState<string>('');
  
  if (!dossier) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRapport || !contenu) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }
    
    // Create avis de décision
    const avis: AvisDecision = {
      id: generateId(),
      dossierId: dossier.id,
      rapportId: selectedRapport,
      date: new Date().toISOString(),
      contenu: contenu,
      resultat: resultat,
      commentaires: commentaires,
      status: 'transmis'
    };
    
    // In a real app, we would save the avis to the database
    
    toast({
      title: "Avis de décision transmis",
      description: "L'avis de décision a été transmis au comité de validation",
    });
    
    onAvisSubmitted();
    
    // Reset form
    setSelectedRapport('');
    setContenu('');
    setResultat('favorable');
    setCommentaires('');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Avis de décision pour {dossier.operateurNom}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="rapport">Rapport d'inspection</Label>
            <Select 
              value={selectedRapport} 
              onValueChange={setSelectedRapport}
            >
              <SelectTrigger id="rapport">
                <SelectValue placeholder="Sélectionner un rapport d'inspection" />
              </SelectTrigger>
              <SelectContent>
                {rapports.length > 0 ? (
                  rapports.map((rapport) => (
                    <SelectItem key={rapport.id} value={rapport.id}>
                      Rapport du {new Date(rapport.date).toLocaleDateString()}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="demo-rapport">Rapport d'inspection (démo)</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="contenu">Contenu de l'avis</Label>
            <Textarea
              id="contenu"
              value={contenu}
              onChange={e => setContenu(e.target.value)}
              rows={8}
              placeholder="Détaillez votre avis technique sur la conformité du produit..."
              className="resize-y"
            />
          </div>
          
          <div>
            <Label>Résultat de l'évaluation</Label>
            <RadioGroup 
              value={resultat} 
              onValueChange={value => setResultat(value as 'favorable' | 'defavorable' | 'avec_reserves')}
              className="mt-2 space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="favorable" id="favorable" />
                <Label htmlFor="favorable" className="cursor-pointer font-normal">Avis favorable</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="avec_reserves" id="avec_reserves" />
                <Label htmlFor="avec_reserves" className="cursor-pointer font-normal">Avis favorable avec réserves</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="defavorable" id="defavorable" />
                <Label htmlFor="defavorable" className="cursor-pointer font-normal">Avis défavorable</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label htmlFor="commentaires">Commentaires additionnels</Label>
            <Textarea
              id="commentaires"
              value={commentaires}
              onChange={e => setCommentaires(e.target.value)}
              rows={3}
              placeholder="Commentaires complémentaires ou précisions sur l'avis..."
              className="resize-y"
            />
          </div>
          
          <Button type="submit" className="bg-certif-blue hover:bg-certif-blue/90">
            <Send className="mr-2 h-4 w-4" />
            Transmettre l'avis au comité de validation
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AvisDecisionTab;
