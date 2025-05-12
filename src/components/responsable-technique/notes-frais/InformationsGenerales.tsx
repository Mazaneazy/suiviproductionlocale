
import React from 'react';
import { FormControl, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NoteFrais } from '@/types';

export interface InformationsGeneralesProps {
  newNoteFrais: Partial<NoteFrais>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  dossierNom?: string;
}

const InformationsGenerales: React.FC<InformationsGeneralesProps> = ({ 
  newNoteFrais,
  onInputChange,
  dossierNom = "Non spécifié"
}) => {
  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Informations générales</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <div className="text-sm font-medium">Dossier associé:</div>
          <div className="text-sm bg-gray-100 p-2 rounded">
            {dossierNom}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormControl>
            <FormLabel htmlFor="date">Date</FormLabel>
            <Input
              id="date"
              name="date"
              type="date"
              value={newNoteFrais.date?.split('T')[0] || new Date().toISOString().split('T')[0]}
              onChange={onInputChange}
              className="w-full"
            />
          </FormControl>
          
          <FormControl>
            <FormLabel htmlFor="inspecteurNom">Responsable technique</FormLabel>
            <Input
              id="inspecteurNom"
              name="inspecteurNom"
              value={newNoteFrais.inspecteurNom || ''}
              onChange={onInputChange}
              className="w-full bg-gray-50"
              readOnly
            />
          </FormControl>
        </div>

        <FormControl>
          <FormLabel htmlFor="description">Description</FormLabel>
          <Textarea
            id="description"
            name="description"
            value={newNoteFrais.description || ''}
            onChange={onInputChange}
            placeholder="Description détaillée des frais"
            className="w-full"
            rows={4}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="commentaire">Commentaires additionnels</FormLabel>
          <Textarea
            id="commentaire"
            name="commentaire"
            value={newNoteFrais.commentaire || ''}
            onChange={onInputChange}
            placeholder="Commentaires ou notes supplémentaires"
            className="w-full"
            rows={2}
          />
        </FormControl>
      </CardContent>
    </Card>
  );
};

export default InformationsGenerales;
