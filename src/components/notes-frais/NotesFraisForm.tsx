
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Dossier } from '@/types';

interface NotesFraisFormProps {
  newNoteFrais: {
    dossierId: string;
    date: string;
    fraisGestion: number;
    fraisInspection: number;
    fraisAnalyses: number;
    fraisSurveillance: number;
    commentaire: string;
  };
  dossiers: Dossier[];
  fileInputRef: React.RefObject<HTMLInputElement>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDossierChange: (value: string) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
}

const NotesFraisForm: React.FC<NotesFraisFormProps> = ({
  newNoteFrais,
  dossiers,
  fileInputRef,
  onInputChange,
  onDossierChange,
  onFileChange,
  onSave
}) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="dossierId" className="text-right font-medium text-sm">
          Dossier*
        </label>
        <Select
          value={newNoteFrais.dossierId}
          onValueChange={onDossierChange}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Sélectionner un dossier" />
          </SelectTrigger>
          <SelectContent>
            {dossiers.map((dossier) => (
              <SelectItem key={dossier.id} value={dossier.id}>
                {dossier.operateurNom} - {dossier.typeProduit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="date" className="text-right font-medium text-sm">
          Date
        </label>
        <Input
          id="date"
          name="date"
          type="date"
          value={newNoteFrais.date}
          onChange={onInputChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="fraisGestion" className="text-right font-medium text-sm">
          Gestion du dossier (FCFA)
        </label>
        <Input
          id="fraisGestion"
          name="fraisGestion"
          type="number"
          value={newNoteFrais.fraisGestion}
          onChange={onInputChange}
          className="col-span-3"
          min={0}
          step="1000"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="fraisInspection" className="text-right font-medium text-sm">
          Inspection/Échantillonage (FCFA)
        </label>
        <Input
          id="fraisInspection"
          name="fraisInspection"
          type="number"
          value={newNoteFrais.fraisInspection}
          onChange={onInputChange}
          className="col-span-3"
          min={0}
          step="1000"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="fraisAnalyses" className="text-right font-medium text-sm">
          Analyses/Essais (FCFA)
        </label>
        <Input
          id="fraisAnalyses"
          name="fraisAnalyses"
          type="number"
          value={newNoteFrais.fraisAnalyses}
          onChange={onInputChange}
          className="col-span-3"
          min={0}
          step="1000"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="fraisSurveillance" className="text-right font-medium text-sm">
          Surveillance (FCFA)
        </label>
        <Input
          id="fraisSurveillance"
          name="fraisSurveillance"
          type="number"
          value={newNoteFrais.fraisSurveillance}
          onChange={onInputChange}
          className="col-span-3"
          min={0}
          step="1000"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="commentaire" className="text-right font-medium text-sm">
          Commentaire
        </label>
        <Input
          id="commentaire"
          name="commentaire"
          value={newNoteFrais.commentaire}
          onChange={onInputChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="fichier" className="text-right font-medium text-sm">
          Document
        </label>
        <div className="col-span-3">
          <Input
            id="fichier"
            type="file"
            ref={fileInputRef}
            onChange={onFileChange}
            accept="image/*,.pdf"
            className="col-span-3"
          />
          <p className="text-xs text-gray-500 mt-1">
            Formats acceptés: PDF, JPG, PNG (max 5 MB)
          </p>
        </div>
      </div>
      <DialogFooter className="mt-4">
        <DialogClose asChild>
          <Button variant="outline">Annuler</Button>
        </DialogClose>
        <Button onClick={onSave} className="bg-certif-blue hover:bg-certif-blue/90">
          Enregistrer
        </Button>
      </DialogFooter>
    </div>
  );
};

export default NotesFraisForm;
