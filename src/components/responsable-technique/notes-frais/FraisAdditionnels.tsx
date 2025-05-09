
import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface FraisAdditionnelsProps {
  fraisGestion: number;
  fraisInspection: number;
  fraisSurveillance: number;
  setFraisGestion: (value: number) => void;
  setFraisInspection: (value: number) => void;
  setFraisSurveillance: (value: number) => void;
}

const FraisAdditionnels: React.FC<FraisAdditionnelsProps> = ({
  fraisGestion,
  fraisInspection,
  fraisSurveillance,
  setFraisGestion,
  setFraisInspection,
  setFraisSurveillance
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-certif-blue mb-4">Frais additionnels</h3>
      <Card className="p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fraisGestion">Frais de gestion du dossier (FCFA)</Label>
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
  );
};

export default FraisAdditionnels;
