
import React, { ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface InformationsGeneralesProps {
  description: string;
  onDescriptionChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const InformationsGenerales: React.FC<InformationsGeneralesProps> = ({
  description,
  onDescriptionChange,
  onFileChange,
  fileInputRef
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations générales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={description}
              onChange={onDescriptionChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fichier">Document justificatif (optionnel)</Label>
            <Input
              id="fichier"
              name="fichier"
              type="file"
              ref={fileInputRef}
              onChange={onFileChange}
              className="cursor-pointer"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InformationsGenerales;
