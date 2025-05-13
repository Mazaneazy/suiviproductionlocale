import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dossier, RapportInspection, AvisDecision } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AvisDecisionTabProps {
  dossier: Dossier;
  rapports: RapportInspection[];
  onAvisSaved: (avis: AvisDecision) => void;
}

const AvisDecisionTab: React.FC<AvisDecisionTabProps> = ({ dossier, rapports, onAvisSaved }) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [decision, setDecision] = useState<'favorable' | 'defavorable' | 'reserve'>('favorable');
  const [motifs, setMotifs] = useState('');
  const [recommandations, setRecommandations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const rapport = rapports.length > 0 ? rapports[0] : null;

  const decisions = [
    { id: 'favorable', label: 'Favorable', description: 'Accord pour la certification' },
    { id: 'defavorable', label: 'Défavorable', description: 'Refus de certification' },
    { id: 'reserve', label: 'Avec réserve', description: 'Accord sous conditions' },
  ];

  const handleRecommandationChange = (recommandation: string, checked: boolean) => {
    if (checked) {
      setRecommandations([...recommandations, recommandation]);
    } else {
      setRecommandations(recommandations.filter(r => r !== recommandation));
    }
  };

  const handleSaveAvis = async () => {
    setLoading(true);
    try {
      const newAvis = {
        dossier_id: dossier.id,
        date_creation: new Date().toISOString(),
        decision: decision,  // This will be "favorable", "defavorable", or "reserve"
        motifs: motifs,
        recommandations: decision === 'reserve' ? recommandations : [],
        responsable: currentUser?.id || 'system',
      };

      onAvisSaved(newAvis);

      toast({
        title: "Avis enregistré",
        description: "L'avis a été enregistré avec succès."
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'avis:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'enregistrement de l'avis."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Avis et décision</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="decision">Décision</Label>
            <Select value={decision} onValueChange={setDecision}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner une décision" />
              </SelectTrigger>
              <SelectContent>
                {decisions.map(d => (
                  <SelectItem key={d.id} value={d.id}>{d.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="motifs">Motifs</Label>
            <Textarea id="motifs" value={motifs} onChange={(e) => setMotifs(e.target.value)} placeholder="Motifs de la décision" />
          </div>

          {decision === 'reserve' && (
            <div className="space-y-2">
              <Label>Recommandations</Label>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Checkbox id="recommandation1" checked={recommandations.includes('actions_correctives')} onCheckedChange={(checked) => handleRecommandationChange('actions_correctives', checked!)} />
                  <Label htmlFor="recommandation1">Mise en place d'actions correctives</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="recommandation2" checked={recommandations.includes('suivi_renforce')} onCheckedChange={(checked) => handleRecommandationChange('suivi_renforce', checked!)} />
                  <Label htmlFor="recommandation2">Suivi renforcé</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="recommandation3" checked={recommandations.includes('nouvelle_inspection')} onCheckedChange={(checked) => handleRecommandationChange('nouvelle_inspection', checked!)} />
                  <Label htmlFor="recommandation3">Nouvelle inspection</Label>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <p className="text-sm text-gray-500">
          Basé sur le rapport du {rapport ? new Date(rapport.date_creation).toLocaleDateString() : new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSaveAvis} disabled={loading} className="bg-certif-blue hover:bg-certif-blue/90">
          {loading ? "Enregistrement..." : "Enregistrer l'avis"}
        </Button>
      </div>
    </div>
  );
};

export default AvisDecisionTab;
