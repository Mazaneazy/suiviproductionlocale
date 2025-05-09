
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import PdfAttachment from '@/components/dossiers/PdfAttachment';
import { useToast } from '@/hooks/use-toast';
import { Dossier, Inspection, RapportInspection } from '@/types';
import { Send, MessageSquare } from 'lucide-react';

interface RapportInspectionFormProps {
  dossier: Dossier;
  inspection: Inspection;
  onSubmit: (rapport: RapportInspection) => void;
}

const RapportInspectionForm: React.FC<RapportInspectionFormProps> = ({ 
  dossier, 
  inspection, 
  onSubmit 
}) => {
  const { toast } = useToast();
  const [contenu, setContenu] = useState('');
  const [avisTechnique, setAvisTechnique] = useState('');
  const [recommandations, setRecommandations] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleAddAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments([...attachments, ...newFiles]);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const handleSubmit = () => {
    if (!contenu) {
      toast({
        title: "Contenu requis",
        description: "Veuillez saisir le contenu du rapport",
        variant: "destructive",
      });
      return;
    }

    const rapport: RapportInspection = {
      id: Math.random().toString(36).substring(2, 9),
      dossierId: dossier.id,
      inspectionId: inspection.id,
      date: new Date().toISOString(),
      contenu,
      avisTechnique: avisTechnique || undefined,
      recommandations: recommandations || undefined,
      fichierUrl: attachments.length > 0 ? `https://example.com/rapports/${dossier.id}/rapport.pdf` : undefined,
      status: 'en_attente'
    };

    onSubmit(rapport);

    toast({
      title: "Rapport créé",
      description: "Le rapport a été créé et sera transmis au directeur",
    });
  };

  return (
    <div className="space-y-6">
      <div className="p-4 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-medium mb-1">Détails de l'inspection</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Date:</span> {new Date(inspection.dateInspection).toLocaleDateString()}
          </div>
          <div>
            <span className="text-gray-500">Lieu:</span> {inspection.lieu}
          </div>
          <div>
            <span className="text-gray-500">Résultat:</span> {
              inspection.resultat === 'conforme' ? 'Conforme' :
              inspection.resultat === 'non_conforme' ? 'Non conforme' : 'En attente'
            }
          </div>
          <div>
            <span className="text-gray-500">Inspecteurs:</span> {inspection.inspecteurs.join(', ')}
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="contenu">Contenu du rapport</Label>
          <Textarea
            id="contenu"
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            className="min-h-[120px]"
            placeholder="Détails du rapport d'inspection..."
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="avis" className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            Avis technique
          </Label>
          <Textarea
            id="avis"
            value={avisTechnique}
            onChange={(e) => setAvisTechnique(e.target.value)}
            className="min-h-[100px]"
            placeholder="Votre avis technique sur les résultats d'inspection..."
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="recommandations">Recommandations</Label>
          <Textarea
            id="recommandations"
            value={recommandations}
            onChange={(e) => setRecommandations(e.target.value)}
            className="min-h-[100px]"
            placeholder="Vos recommandations pour le directeur d'évaluation..."
          />
        </div>
        
        <div className="space-y-2">
          <Label>Pièces jointes</Label>
          <PdfAttachment
            attachments={attachments}
            onAddAttachment={handleAddAttachment}
            onRemoveAttachment={handleRemoveAttachment}
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          className="bg-certif-blue hover:bg-certif-blue/90"
        >
          <Send className="h-4 w-4 mr-2" />
          Transmettre au directeur d'évaluation
        </Button>
      </div>
    </div>
  );
};

export default RapportInspectionForm;
