
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export interface RecapitulatifFraisProps {
  fraisGestion: number;
  fraisInspection: number;
  fraisAnalyses: number;
  fraisSurveillance: number;
  total: number;
  totalPrix?: number; // Added missing property
  description?: string; // Added missing property
  setDescription?: (value: string) => void; // Added missing property
}

const RecapitulatifFrais: React.FC<RecapitulatifFraisProps> = ({
  fraisGestion,
  fraisInspection,
  fraisAnalyses,
  fraisSurveillance,
  total
}) => {
  // Formater les nombres en format monétaire
  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(montant);
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Récapitulatif des frais</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Frais de gestion:</span>
            <span className="font-medium">{formatMontant(fraisGestion)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Frais d'inspection:</span>
            <span className="font-medium">{formatMontant(fraisInspection)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Frais d'analyses:</span>
            <span className="font-medium">{formatMontant(fraisAnalyses)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Frais de surveillance:</span>
            <span className="font-medium">{formatMontant(fraisSurveillance)}</span>
          </div>
          
          <Separator className="my-3" />
          
          <div className="flex justify-between font-semibold text-base">
            <span>Total:</span>
            <span className="text-certif-blue">{formatMontant(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecapitulatifFrais;
