
import React, { useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { NoteFrais, Dossier } from '@/types';
import { useNotesFraisForm } from '@/components/responsable-technique/notes-frais/useNotesFraisForm';
import FraisAdditionnels from '@/components/responsable-technique/notes-frais/FraisAdditionnels';
import RecapitulatifFrais from '@/components/responsable-technique/notes-frais/RecapitulatifFrais';
import FormActions from '@/components/responsable-technique/notes-frais/FormActions';
import ParametresAnalyseForm from '@/components/notes-frais/ParametresAnalyseForm';
import { generateNoteFraisPDF } from '@/services/pdfService';

interface NotesFraisFormProps {
  dossier: Dossier;
  onNoteFraisCreated?: () => void;
}

const NotesFraisForm: React.FC<NotesFraisFormProps> = ({ 
  dossier, 
  onNoteFraisCreated = () => {} 
}) => {
  const { currentUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    selectedParametres,
    fraisGestion,
    fraisInspection,
    fraisSurveillance,
    total,
    description,
    setDescription,
    isSubmitting,
    handleSubmit,
    handleInputChange,
    handleFileChange,
    setFraisGestion,
    setFraisInspection,
    setFraisSurveillance,
    totalPrix
  } = useNotesFraisForm(dossier, onNoteFraisCreated);
  
  const handleParametresChange = (parametres: string[]) => {
    // This function will be passed to ParametresAnalyseForm
    // The hook already handles this now
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
                onChange={handleInputChange}
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
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <FraisAdditionnels
        fraisGestion={fraisGestion}
        fraisInspection={fraisInspection}
        fraisSurveillance={fraisSurveillance}
        setFraisGestion={setFraisGestion}
        setFraisInspection={setFraisInspection}
        setFraisSurveillance={setFraisSurveillance}
      />
      
      <ParametresAnalyseForm
        selectedParametres={selectedParametres}
        onChange={handleParametresChange}
      />
      
      <RecapitulatifFrais 
        fraisGestion={fraisGestion}
        fraisInspection={fraisInspection}
        fraisAnalyses={totalPrix}
        fraisSurveillance={fraisSurveillance}
        total={total}
        totalPrix={totalPrix}
        description={description}
        setDescription={setDescription}
      />
      
      <FormActions 
        isSubmitting={isSubmitting}
        onReset={() => {
          // Reset functionality
          setFraisGestion(50000);
          setFraisInspection(75000);
          setFraisSurveillance(40000);
          setDescription('');
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }}
      />
    </form>
  );
};

export default NotesFraisForm;
