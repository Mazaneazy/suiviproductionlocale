
import React, { useState, useRef } from 'react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
  onNoteFraisCreated 
}) => {
  const { addNoteFrais } = useData();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parametresAnalyse, setParametresAnalyse] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const inspecteurId = currentUser?.id || '';
  
  const [newNoteFrais, setNewNoteFrais] = useState<Partial<NoteFrais>>({
    dossierId: dossier.id,
    inspecteurId: inspecteurId,
    date: new Date().toISOString().split('T')[0],
    description: `Note de frais - ${dossier.operateurNom} - ${dossier.typeProduit}`,
    fraisGestion: 50000,
    fraisInspection: 75000,
    fraisAnalyses: 60000,
    fraisSurveillance: 40000,
    status: 'en_attente',
    commentaire: '',
    parametresAnalyse: []
  });
  
  const { handleInputChange, handleFileChange } = useNotesFraisForm(
    newNoteFrais, 
    setNewNoteFrais, 
    setUploadedFile
  );
  
  const calculerTotal = () => {
    return (
      (newNoteFrais.fraisGestion || 0) + 
      (newNoteFrais.fraisInspection || 0) + 
      (newNoteFrais.fraisAnalyses || 0) + 
      (newNoteFrais.fraisSurveillance || 0)
    );
  };
  
  const handleParametresChange = (parametres: string[]) => {
    setParametresAnalyse(parametres);
    setNewNoteFrais({
      ...newNoteFrais,
      parametresAnalyse: parametres
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculer le montant total
    const total = calculerTotal();
    
    // Simuler l'upload du fichier
    let fichierUrl = '';
    if (uploadedFile) {
      fichierUrl = `document-${Date.now()}-${uploadedFile.name}`;
    }
    
    // Créer l'objet note de frais complet
    const noteFraisComplete: Omit<NoteFrais, 'id'> = {
      dossierId: dossier.id,
      inspecteurId: newNoteFrais.inspecteurId || inspecteurId,
      date: newNoteFrais.date || new Date().toISOString(),
      dateCreation: new Date().toISOString(),
      description: newNoteFrais.description || `Note de frais - ${dossier.operateurNom}`,
      montant: total,
      status: 'en_attente',
      acquitte: false,
      fraisGestion: newNoteFrais.fraisGestion,
      fraisInspection: newNoteFrais.fraisInspection,
      fraisAnalyses: newNoteFrais.fraisAnalyses,
      fraisSurveillance: newNoteFrais.fraisSurveillance,
      commentaire: newNoteFrais.commentaire,
      fichierUrl: fichierUrl || undefined,
      notificationEnvoyee: false,
      operateurNotifie: false,
      parametresAnalyse: parametresAnalyse
    };
    
    // Générer le PDF
    const pdfData = generateNoteFraisPDF(noteFraisComplete as NoteFrais, dossier);
    noteFraisComplete.pdfUrl = pdfData;
    
    // Ajouter la note de frais
    addNoteFrais(noteFraisComplete);
    
    toast({
      title: "Note de frais créée",
      description: "La note de frais a été créée avec succès",
    });
    
    // Réinitialiser le formulaire
    setNewNoteFrais({
      dossierId: dossier.id,
      inspecteurId: inspecteurId,
      date: new Date().toISOString().split('T')[0],
      fraisGestion: 50000,
      fraisInspection: 75000,
      fraisAnalyses: 60000,
      fraisSurveillance: 40000,
      status: 'en_attente',
      commentaire: '',
      parametresAnalyse: []
    });
    setUploadedFile(null);
    setParametresAnalyse([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Callback
    if (onNoteFraisCreated) {
      onNoteFraisCreated();
    }
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
                value={newNoteFrais.description || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={newNoteFrais.date || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="commentaire">Commentaire (optionnel)</Label>
              <Textarea
                id="commentaire"
                name="commentaire"
                value={newNoteFrais.commentaire || ''}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="fichier">Document justificatif (optionnel)</Label>
              <Input
                id="fichier"
                name="fichier"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              {uploadedFile && (
                <p className="text-sm text-gray-500 mt-1">
                  Fichier: {uploadedFile.name} ({Math.round(uploadedFile.size / 1024)} KB)
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <FraisAdditionnels
        newNoteFrais={newNoteFrais}
        onInputChange={handleInputChange}
      />
      
      <ParametresAnalyseForm
        selectedParametres={parametresAnalyse}
        onChange={handleParametresChange}
      />
      
      <RecapitulatifFrais 
        fraisGestion={newNoteFrais.fraisGestion || 0}
        fraisInspection={newNoteFrais.fraisInspection || 0}
        fraisAnalyses={newNoteFrais.fraisAnalyses || 0}
        fraisSurveillance={newNoteFrais.fraisSurveillance || 0}
        total={calculerTotal()}
      />
      
      <FormActions onReset={() => {
        setNewNoteFrais({
          dossierId: dossier.id,
          inspecteurId: inspecteurId,
          date: new Date().toISOString().split('T')[0],
          fraisGestion: 50000,
          fraisInspection: 75000,
          fraisAnalyses: 60000,
          fraisSurveillance: 40000,
          status: 'en_attente',
          commentaire: ''
        });
        setUploadedFile(null);
        setParametresAnalyse([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }} />
    </form>
  );
};

export default NotesFraisForm;
