
import React, { useState, useRef } from 'react';
import { FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Dossier } from '@/types';

interface ChecklistTabProps {
  dossier: Dossier | null;
  onChecklistSubmitted: () => void;
}

const ChecklistTab: React.FC<ChecklistTabProps> = ({ dossier, onChecklistSubmitted }) => {
  const { toast } = useToast();
  const [planInspection, setPlanInspection] = useState<File | null>(null);
  const [planEchantillonage, setPlanEchantillonage] = useState<File | null>(null);
  const planInspectionRef = useRef<HTMLInputElement>(null);
  const planEchantillonageRef = useRef<HTMLInputElement>(null);
  
  if (!dossier) return null;
  
  const handlePlanInspectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPlanInspection(e.target.files[0]);
    }
  };
  
  const handlePlanEchantillonageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPlanEchantillonage(e.target.files[0]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!planInspection || !planEchantillonage) {
      toast({
        title: "Documents manquants",
        description: "Veuillez télécharger les deux documents requis",
        variant: "destructive",
      });
      return;
    }
    
    // In a real application, we would upload the files to a server
    // and save the URLs in the database
    // Here we just simulate this
    
    toast({
      title: "Documents téléchargés",
      description: "Les plans d'inspection et d'échantillonnage ont été téléchargés avec succès."
    });
    
    onChecklistSubmitted();
    
    // Reset form
    setPlanInspection(null);
    setPlanEchantillonage(null);
    if (planInspectionRef.current) planInspectionRef.current.value = '';
    if (planEchantillonageRef.current) planEchantillonageRef.current.value = '';
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Checklist d'inspection pour {dossier.operateurNom}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="plan-inspection">Plan d'inspection</Label>
            <div className="mt-1">
              <Input
                id="plan-inspection"
                ref={planInspectionRef}
                type="file"
                accept=".pdf"
                onChange={handlePlanInspectionChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-certif-blue
                  hover:file:bg-blue-100"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Téléchargez le plan d'inspection détaillant les points à contrôler et les critères d'évaluation
            </p>
          </div>
          
          <div>
            <Label htmlFor="plan-echantillonage">Plan d'échantillonnage</Label>
            <div className="mt-1">
              <Input
                id="plan-echantillonage"
                ref={planEchantillonageRef}
                type="file"
                accept=".pdf"
                onChange={handlePlanEchantillonageChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-certif-blue
                  hover:file:bg-blue-100"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Téléchargez le plan d'échantillonnage indiquant les méthodes et quantités d'échantillons à prélever
            </p>
          </div>
          
          <Button type="submit" className="bg-certif-blue hover:bg-certif-blue/90">
            <FileUp className="mr-2 h-4 w-4" />
            Télécharger les documents
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChecklistTab;
