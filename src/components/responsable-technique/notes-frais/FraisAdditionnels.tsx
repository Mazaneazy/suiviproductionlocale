
import React from 'react';
import { FormControl, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NoteFrais } from '@/types';
import { Separator } from '@/components/ui/separator';

export interface FraisAdditionnelsProps {
  newNoteFrais: Partial<NoteFrais>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FraisAdditionnels: React.FC<FraisAdditionnelsProps> = ({ 
  newNoteFrais,
  onInputChange
}) => {
  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Frais additionnels</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Separator className="my-3" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormControl>
            <FormLabel htmlFor="fraisGestion">Frais de gestion (FCFA)</FormLabel>
            <Input
              id="fraisGestion"
              name="fraisGestion"
              type="number"
              value={newNoteFrais.fraisGestion || 0}
              onChange={onInputChange}
              className="w-full"
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="fraisInspection">Frais d'inspection (FCFA)</FormLabel>
            <Input
              id="fraisInspection"
              name="fraisInspection"
              type="number"
              value={newNoteFrais.fraisInspection || 0}
              onChange={onInputChange}
              className="w-full"
            />
          </FormControl>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormControl>
            <FormLabel htmlFor="fraisAnalyses">Frais d'analyses (FCFA)</FormLabel>
            <Input
              id="fraisAnalyses"
              name="fraisAnalyses"
              type="number"
              value={newNoteFrais.fraisAnalyses || 0}
              onChange={onInputChange}
              className="w-full"
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="fraisSurveillance">Frais de surveillance (FCFA)</FormLabel>
            <Input
              id="fraisSurveillance"
              name="fraisSurveillance"
              type="number"
              value={newNoteFrais.fraisSurveillance || 0}
              onChange={onInputChange}
              className="w-full"
            />
          </FormControl>
        </div>
      </CardContent>
    </Card>
  );
};

export default FraisAdditionnels;
