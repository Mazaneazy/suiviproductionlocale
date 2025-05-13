
import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface RecapitulatifFraisProps {
  totalPrix: number;
  fraisGestion: number;
  fraisInspection: number;
  fraisSurveillance: number;
  total: number;
  description: string;
  setDescription: (value: string) => void;
}

const RecapitulatifFrais: React.FC<RecapitulatifFraisProps> = ({
  totalPrix,
  fraisGestion,
  fraisInspection,
  fraisSurveillance,
  total,
  description,
  setDescription
}) => {
  return (
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
  );
};

export default RecapitulatifFrais;
